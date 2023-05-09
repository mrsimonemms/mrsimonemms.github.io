---
image: /img/blog/nicolas-dmitrichev-3dlCVIwobdk-unsplash.jpg
title: Setting Terraform Service Principal Permissions to Work With Azure Active Directory
credits: Photo by [Nichols Dmitrichev](https://unsplash.com/@uinyp?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: Terraform is a great way of configuring your cloud infrastructure, but adding the permissions to work with Azure Active Directory is always difficult to remember
tags: terraform, azure, service principal, permissions, devops
---

There are certain things that, no matter how many times I do them, I always have
to look up. Symbolic links, for instance, are one thing I must have done at least
once a week for the past 10 years, but I just can't remember whether the `/path/to/file`
or the `/path/to/symlink` comes first (it's `ln -s /path/to/file /path/to/symlink`
for the record).

Configuring the permissions for a service principal to work with Azure Active
Directory is a close second. Unlike the symlink though, the documentation for
this is [dreadful](https://registry.terraform.io/providers/hashicorp/azuread/latest/docs);
all the commands are there, but it's just so verbose and wordy that I always
miss something.

For anyone just interested in the answer (including Future Simon), the _tl;dr_
is [here](#how-to-set-it-up)

## What's a Service Principal

From the [Azure documentation](https://docs.microsoft.com/en-us/powershell/azure/create-azure-service-principal-azureps):

> An Azure service principal is an identity created for use with applications, hosted
> services, and automated tools to access Azure resources. This access is restricted
> by the roles assigned to the service principal, giving you control over which
> resources can be accessed and at which level. For security reasons, it's always
> recommended to use service principals with automated tools rather than allowing
> them to log in with a user identity.

## What's So Special About Active Directory

In the topology of Azure, the [AzureRM](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
resources and the [AzureAD](https://registry.terraform.io/providers/hashicorp/azuread/latest)
resources occupy a different place. AzureRM (short for "Azure Resource Manager")
lives under a subscription. In normal circumstances, and by default, Azure will
only have a single subscription per account. All the resources (such as a
virtual machine) will live in here. When you want to manage one of these
resources with Terraform, simply give the service principal the appropriate
permissions (I usually go with `Owner`) on the subscription and everything will
work fine.

Active Directory is different. Logically, the Active Directory resources sit
outside the subscription. These are on the account itself. That means that, if
you have multiple subscriptions on your Azure account, you would still only have
a single Active Directory which manages things for both subscriptions.

This means that the permissions model is different in Active Directory to the
subscriptions.

[![Subscription IAM](/img/blog/azure-active-directory/subscription-iam.png)](/img/blog/azure-active-directory/subscription-iam.png)

This is the Identity and Access Management (IAM) page for a subscription. As you
can see, the "Terraform" Service Principal has the "Owner" role. The
"Access control (IAM)" blade doesn't exist for the Active Directory.

## Why Would You Ever Want To Mess About With The Active Directory

There are plenty of legitimate reasons to work with the Active Directory in
Terraform. One of my most regular reasons is, when setting up a Kubernetes
cluster, I also set up an "admins" and a "users" group for managing which users
can get access to the cluster. Those in the "admins" group have full admin
access to the cluster, those in the "users" group can only get limited access
via the role-based access control (RBAC) settings. The configuration for that
is fairly simple:

```terraform
data "azurerm_client_config" "current" {}

resource "azuread_group" "admin" {
  name = "k8s-admin"
  description = "Admin-level members for Kubernetes"
  owners = [data.azurerm_client_config.current.object_id]
  prevent_duplicate_names = true
}

resource "azuread_group" "user" {
  name = "k8s-user"
  description = "User-level members for Kubernetes"
  owners = [data.azurerm_client_config.current.object_id]
  prevent_duplicate_names = true
}

resource "azurerm_kubernetes_cluster" "k8s" {
  role_based_access_control {
    enabled = true
    azure_active_directory {
      tenant_id = data.azurerm_client_config.current.tenant_id
      managed = true
      admin_group_object_ids = [azuread_group.admin.id]
    }
  }

  # Additional configuration - see Terraform docs for details
}

resource "azurerm_role_assignment" "admin" {
  principal_id = azuread_group.admin.id
  scope = azurerm_resource_group.k8s.id
  role_definition_name = "Azure Kubernetes Service Cluster Admin Role"
}

resource "azurerm_role_assignment" "user" {
  principal_id = azuread_group.user.id
  scope = azurerm_resource_group.k8s.id
  role_definition_name = "Azure Kubernetes Service Cluster User Role"
}
```

Any user added to either of these groups will get the appropriate permissions
on the Kubernetes cluster.

## How To Set It Up

We'll be setting up the service principal as a Group Administrator and also
giving the service principal the appropriate API access.

### Setting as a Group Administrator

This gives the service principal to administer groups. This is needed to add
and remove groups and assign members to it.

- Log into [portal.azure.com](https://portal.azure.com) and navigate to [Azure Active
Directory](https://portal.azure.com/?quickstart=True#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview).
- Select the [Roles and Administrators](https://portal.azure.com/?quickstart=True#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RolesAndAdministrators)
- Select the role Groups Administrator
- Select "Add assignments" and add your service principal

### Granting API Access

> Important. The Terraform provider still uses the old (and deprecated) API rather
> than the new Microsoft Graph API. [Work](https://github.com/hashicorp/terraform-provider-azuread/issues/323)
> is happening to move over to that, but at the time of writing, is still incomplete.

- Log into [portal.azure.com](https://portal.azure.com) and navigate to [Azure Active
Directory](https://portal.azure.com/?quickstart=True#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview).
- Select the [App Registrations](https://portal.azure.com/?quickstart=True#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps)
blade
- Select your service principal
- Select "API permissions" from the blade on the left
- Select "Add a permission" and select the legacy "Azure Active Directory Graph"
at the very bottom of the page.
- Under "Delegated permissions", select "Directory.ReadWrite.All" and
"Group.ReadWrite.All". Then click "Add permissions" to save.
- Select "Add a permission", select the "Azure Active Directory Directory Graph"
again
- Under "Application permissions", select "Application.ReadWrite.All". Then click
"Add permissions" to save

That's it. Now when you run `terraform apply`, it will have the permissions to
create the groups with your desired configuration. Importantly, if you
`terraform destroy`, it will also have the permissions to delete the configuration.

### Delegation Permissions

[![Delegate Permissions](/img/blog/azure-active-directory/delegated-permissions.png)](/img/blog/azure-active-directory/delegated-permissions.png)

### Application Permissions

[![Application Permissions](/img/blog/azure-active-directory/application-permissions.png)](/img/blog/azure-active-directory/application-permissions.png)
