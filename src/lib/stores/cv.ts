export interface ICV {
  basics: {
    name: string;
    label: string;
    picture: string;
    email: string;
    phone: string;
    summary?: string;
    location: {
      city: string;
      countryCode: string;
    };
    profiles: {
      network: string;
      username: string;
      url: string;
    }[];
  };
  education: {
    institution: string;
    area: string;
    startDate: Date;
    endDate: Date;
  }[];
  interests: {
    name: string;
  }[];
  projects: {
    name: string;
    publisher?: string;
    website?: string;
    summary: string;
    highlights: string[];
    skills: string[];
  }[];
  references: {
    name: string;
    link: string;
    img: string;
    position: string;
    company: string;
    reference: string;
  }[];
  skills: {
    name: string;
    keywords: string[];
  }[];
  work: {
    company: string;
    position: string;
    website?: string;
    startDate?: Date;
    endDate?: Date;
    summary?: string;
    skills: string[];
    highlights?: string[];
  }[];
}

export const cv: ICV = {
  basics: {
    name: 'Simon Emms',
    label: 'Software Engineer, DevOps, Solutions Designer',
    picture: '/img/face-and-hat.jpg',
    email: 'simon@simonemms.com',
    phone: '+44 7736 650058',
    summary: `An engineer with a wealth of experience in technical leadership, the software development life cycle and implementing a DevOps culture in an existing team. With over a decade of experience building highly scalable software, I can quickly grasp even the most-poorly documented software and communicate solutions to appropriate stakeholders. I am experienced in mentoring junior team members, building up their confidence and skills and providing technical direction to the whole team.`,
    location: {
      city: 'Telford',
      countryCode: 'UK',
    },
    profiles: [
      {
        network: 'GitHub',
        username: 'MrSimonEmms',
        url: 'https://github.com/MrSimonEmms',
      },
      {
        network: 'GitLab',
        username: 'MrSimonEmms',
        url: 'https://gitlab.com/MrSimonEmms',
      },
      {
        network: 'LinkedIn',
        username: 'SimonEmms',
        url: 'https://www.linkedin.com/in/simonemms',
      },
      {
        network: 'Twitter',
        username: 'TheShroppieBeek',
        url: 'https://twitter.com/TheShroppieBeek',
      },
    ],
  },

  education: [
    {
      institution: 'University of Wales, Aberystwyth',
      area: 'International Politics and Strategic Studies',
      startDate: new Date(2001, 8, 1),
      endDate: new Date(2004, 6, 1),
    },
  ],

  interests: [
    { name: 'Gardening' },
    { name: 'Beekeeping' },
    { name: 'Birdwatching' },
    { name: 'Woodworking' },
  ],

  projects: [
    {
      name: 'Gobblr',
      website: 'http://github.com/mrsimonemms/gobblr',
      summary: 'A tool for automatically ingesting data sets into your development stack',
      highlights: [
        'Designed a service for the age-old problem of needing to ingest known data sets into development stack.',
        'Can run as a web service as well as a CLI, the web service being able to be automatically executed prior to each integration test being run. This isolates the tests and data to help guarantee atomic tests.',
        'Only interested in data ingestion rather than the table migration. This enables it to work with cross-platform ORMs out-of-the-box.',
      ],
      skills: ['Go', 'Databases', 'Docker'],
    },
    {
      name: 'BrowserSpy',
      summary:
        'A testing tool that records all website events for replaying at a later date with a simple, two-line installation that works cross-platform.',
      highlights: [
        `Designed a scalable microservice architecture that is able to work with third-party APIs
for authentication and issue tracking. The API is flexible enough to implement additional
third-party services at a later date by creation of an appropriate strategy. The service records
large amounts of binary data so made use of cloud data buckets for optimal read/write capability.`,
        `Established a DevOps workflow using Kubernetes with feature-branch deployments. Configured
a full CI/CD suite, made a series of reusable CI functions to ensure terse configuration files.
Maintained a separation between processes that needed to be real-time and ones that could be
batch-processed later to reduce costs.`,
        `Developed a recorder that is installed and configured in the user's browser that intercepts
the relevant global DOM objects and pushes the events to a message queue for later processing into
a playable timeline. Established metrics with automated tests to ensure that these adhere to
appropriate performance criteria.`,
        `Built a playback service that processed the events into the correct order with all relevant
bucket data pre-loaded. Implemented an iterator pattern to load the data in segments to give a
smooth playback experience.`,
      ],
      skills: [
        'NodeJS',
        'TypeScript',
        'Vue',
        'MongoDB',
        'SocketIO',
        'Docker',
        'Kubernetes',
        'GitLab',
        'Automation',
        'MicroServices',
        'Solutions Design',
      ],
    },
  ],

  references: [
    {
      name: 'Michael Grass',
      link: 'https://www.linkedin.com/in/michael-grass-0a53953a/',
      img: '/img/references/michaelgrass.jpeg',
      position: 'Account Director',
      company: 'Jargon PR',
      reference: `I worked with Simon for six months while he was Lead Developer at Bugfinders and
during this I was not only impressed with his considerable knowledge of code and software, but also
his ability to make the subject accessible to anyone that didn't have a background in programming. I
rate Simon as a dependable, highly knowledgeable programmer. He's an affable individual and a
pleasure to do business with.`,
    },
    {
      name: 'Gary Newbolt',
      link: 'https://www.linkedin.com/in/garynewbolt001/',
      img: '/img/references/garynewbolt.jpeg',
      position: 'Lead Software Developer',
      company: 'Energy Systems Catapult',
      reference: `Simon and I worked together for several years. When I first joined the company he
was my mentor to me as a junior software engineer and helped me to develop and enhance my skills
quickly and efficiently. Largely this was achieved by teaching me higher level principles of software
engineering, and then at the subtleties of the languages we worked in. Simon's extensive experience
in the field of software engineering extends way beyond any single language or DB package and
regularly, when we worked together, he demonstrated advanced knowledge of IT operation, building
environments, CI/CD pipelines, commissioning cloud based resources and and database operations, etc.
On top of this, Simon has a can do attitude and seeks to help the team wherever he can; which given
his extensive toolkit, is pretty much everywhere. In summary, for anyone looking to recruit Simon,
for whatever role you recruit him for, you'll receive a subset of, senior software engineer, an IT
operations expert, a software architect, and a mentor, for free!`,
    },
    {
      name: 'Henk Wobbes',
      img: '/img/references/henkwobbes.jpeg',
      position: 'Lead DevOps Engineer',
      link: 'https://www.linkedin.com/in/henkwobbes/',
      company: 'Energy Systems Catapult',
      reference: `When I started working at the Energy Systems Catapult Simon immediately helped me
in getting up to speed on the idiosyncrasies of the Home Energy System Gateway (HESG) and sharing
his knowledge on the many technical and structural aspects of the system. A lot of the procedures
and tools Simon wrote for HESG are still in use by the DevOps team now. Besides displaying an
extensive technically knowledgeable Simon is a hands-on guy and also , above all, also a really nice
guy. I've enjoyed many good stories on gardening antics and bee-keeping over lunch.

If you need somebody to be able to "think out of the box" and to "get the job done" then Simon is
definitely the man for the job.`,
    },
    {
      name: 'Anthony Byrne',
      img: '/img/references/anthonybyrne.jpeg',
      link: 'https://www.linkedin.com/in/antbyrne/',
      position: 'Digital Solution Delivery Lead',
      company: 'Snap Badger',
      reference: `I've worked with Simon both at the Energy Systems Catapult and on our own joint
venture for a number of years.

On a personal level, Simon is a great friend. He is very astute, a good listener and communicator
and it's a pleasure to be in his company. Simon speaks his mind with honesty and candour. He has
often given of his time and experience to provide advice and help when I've needed it.

Professionally his can-do attitude has always ensured that work is delivered on-time and to the
highest quality. Technically he is adept at working towards solutions to complex problems either
alone or as a key part of a cross-functional team. With a wide range of skills and experience, I've
always found that Simon will add value to any situation, project or relationship.

If you are looking for someone who can design, build, test and deploy working solutions as both a
friend and a colleague, then look no further.`,
    },
    {
      name: 'Matt Wyld',
      img: '/img/references/mattwyld.jpeg',
      link: 'https://www.linkedin.com/in/mattwyld/',
      position: 'Freelance Mobile App Developer',
      company: 'Wyld Web Development',
      reference: `I have worked with Simon for a number of years at ESC and I cannot recommend him
enough. He has a passion for well built software and will always go out his way to help every inch
of software at your company, from supporting and improving legacy systems, integrating with IOT
hardware to architecting new software solutions. He has a through understanding of full stack
development, coding standards and modern theory and principles. Simon is the complete package if
you're looking for someone to be at the forefront of your development team.`,
    },
    {
      name: 'Sundeep Sandhu',
      img: '/img/references/sundeepsandhu.jpeg',
      link: 'https://www.linkedin.com/in/sundeep-sandhu-75bb3110/',
      position: 'Test Lead',
      company: 'Energy Systems Catapult',
      reference: `I worked closely with Simon for three years at the ESC where I was the test
lead. I often sought Simon's help and advice where technical testing was required as this was
not my strong point. Simon always took the time out to explain complex technical software in a
way that I could understand and translate into test artifacts. His help was invaluable in
setting up several test environments where he had to take time out from his own busy workload
but he always did it with a smile and cheerful attitude. It was a pleasure to test any software
that Simon was involved with as it was of a very high standard and made my job in testing easier.

I would love to have the opportunity to work with Simon again and would recommend him to any
client looking for a hard working individual who brings a positive can do attitude to every
project he is involved with.`,
    },
    {
      name: 'Laurie Ainley',
      img: '/img/references/laurieainley.jpeg',
      link: 'https://www.linkedin.com/in/laurieainley/',
      position: 'Co-Founder & CTO',
      company: 'Poplar Studio',
      reference: `We brought Simon in to help with some DevOps tasks at Poplar Studio which
he delivered efficiently ahead of schedule, while also providing support to the rest of the team
beyond the main scope of his contract. He worked effectively independently and collaborated with
the team naturally through his friendly and relaxed nature as well. I'd happily work with Simon
again.`,
    },
    {
      name: 'Christopher Moss',
      img: '/img/references/christophermoss.jpg',
      link: 'https://www.linkedin.com/in/christopher-moss-a6software/',
      position: 'JavaScript (React, Node, TypeScript) Contractor',
      company: 'A6 Software Ltd',
      reference: `Simon is equally skilled in both development and operational tasks, and I
found I learned a great deal from reviewing his well tested code, from the documentation he
provided, and from chatting with him and sharing ideas / approaches to problems.

Simon is dependable, trust worthy, very highly skilled and an all round really nice person who
sincerely wants to deliver high quality software. A true asset to any team.`,
    },
    {
      name: 'Todd Densmore',
      img: '/img/references/todddensmore.jpeg',
      link: 'https://www.linkedin.com/in/todd-densmore/',
      position: 'Cloud Native startups and macrodata refinement',
      company: 'Gitpod',
      reference: `Simon is a fantastic engineer whom I first met and worked closely with
while I was working at Replicated and he was working for Gitpod. Together we worked on a self-hosted
installer for Gitpod. Simon is extremely technical, down to earth, and extremely funny. This
combination of traits makes him a very effective technologist - he is able to clearly see the real
problem to solve and is quick to create a solution. I would love to work alongside Simon anytime / anywhere.`,
    },
    {
      name: 'Rafal (Raf) Liwoch',
      img: '/img/references/rafalliwoch.jpeg',
      link: 'https://www.linkedin.com/in/rafalliwoch/',
      position: 'I do tech stuff',
      company: 'Amazon Web Services',
      reference: `I've had the pleasure to work with Simon for three years. One of Simon's greatest
superpowers is his willingness to experiment, whilst working on multiple projects at the same time. He
is a multitasker with a can-do attitude. His code contributions made a significant impact on the productivity
of the entire software engineering team.

He can singlehandedly engineer a solution and sprinkle it with his great sense of humour. Simon would be
a great addition to any dev team working on a complex piece of software.`,
    },
    {
      name: 'Nandaja Varma',
      img: '/img/references/nandajavarma.jpeg',
      link: 'https://www.linkedin.com/in/nandajavarma/',
      position: 'Kubernetes Engineer',
      company: 'Gitpod',
      reference: `I had the pleasure to work with Simon for almost a year at Gitpod. I have learned
so much from him about work and life. He is a great engineer, who is very passionate about the work that
he does and the technologies that he uses. He goes above and beyond in explaining things and making
sure no one is blocked. A true team player!

Simon is one of the most caring and talented people I have ever worked with. I admire how upfront and
honest he can be at all times. He is amazingly funny and full of encouragement. It has been an incredible
honour working with him. He makes a great addition to any team he joins!`,
    },
    {
      name: 'Kyle Brennan',
      img: '/img/references/kylebrennan.jpeg',
      link: 'https://www.linkedin.com/in/kyle-brennan-3b365773/',
      position: 'Technical Leadership',
      company: 'Gitpod',
      reference: `I was incredibly fortunate to work with Simon and would be excited to again.

Simon is:
* hilarious, but measured when needed
* warm, but stoic when required
* skilled, but humble when sharing
* a rarity, like a unicorn

I joined Gitpod as a senior software engineer in November of 2021. Simon was on my team, and adopted me as an onboarding buddy. He checked in with me daily, we talked about life, and he guided me while I learned the product and started my first couple assignments.

I felt like an integrated member of the team and company because of his effort and patience. He mentored me where I knew I was weak (docker and kubernetes and Linux), where I thought I was stronger (git), and when I was out of my comfort zone (GCP). I'm a better technologist because of him.

A few months later, the company reorganized itself, and Simon moved to a different team. We had less interactions, but what I saw is that he was consistent with his new team. He checked in with his team daily, offered help selflessly, and served where he could add the most value. This was critical because the team was small, we were integrating and extending the product, and new hires joining his team needed help learning the product to become productive.

How else is Simon fantastic? He gravitates towards ambassadorship. How? Here are a few examples:
1. He was a constant member of Gitpod's community, helping customers adopt Gitpod, learning about their needs, and incorporating that feedback into the installer. While doing so, he also built a strong relationship with the Community Team in Gitpod.
2. Gitpod has an installer component (to replace unwieldy Helm charts), and he wrote the lion's share of it. He shared how to use and extend it with the rest of product engineering, granting teams autonomy over the installation experience for their components. As part of the hand-over, he graciously offered office hours to aid in consulting.
3. You can even catch Simon sharing with the ecosystem about his experience with the Gitpod installer at Rejekts in Valencia at https://simonemms.com/speaking/.

If you'd like to schedule a live chat, book some time in his diary at https://calendly.com/simon-emms. You won't regret it. 👋@ Simon. 😀`,
    },
  ],

  skills: [
    {
      name: 'Languages and Frameworks',
      keywords: [
        'NodeJS',
        'TypeScript',
        'PHP',
        'Python',
        'Go',
        'Express',
        'Restify',
        'Vue',
        'Angular',
        'React',
      ],
    },
    {
      name: 'DevOps',
      keywords: [
        'Docker',
        'Kubernetes',
        'Ansible',
        'Terraform',
        'Git/SVN',
        'CI/CD',
        'Semantic Release',
        'GitOps',
      ],
    },
    {
      name: 'Cloud Providers',
      keywords: ['AWS', 'Azure', 'DigitalOcean', 'Google Cloud Platform'],
    },
    {
      name: 'Data Stores',
      keywords: ['MySQL', 'PostgreSQL', 'MongoDB', 'ElasticSearch', 'Cassandra', 'RabbitMQ'],
    },
    {
      name: 'Principles',
      keywords: [
        'Design Patterns',
        'SOLID',
        '12 Factor App',
        'MicroServices',
        'Agile (Scrum/Kanban)',
      ],
    },
    {
      name: 'Other',
      keywords: ['IoT', 'OpenFAAS', 'Mentoring', 'Leadership'],
    },
  ],

  work: [
    {
      company: 'Foundry4',
      position: 'Lead DevOps Consultant (contract)',
      website: 'https://foundry4.com/',
      startDate: new Date(2020, 3, 1),
      summary: `Provided DevOps leadership and consultancy services to help Foundry4 clients level-up their DevOps capability`,
      highlights: [
        'Worked with significant clients, including Ofgem, the British Red Cross and HM Planning Inspectorate, on a wide range of projects. The key arbiter of success was the ability to keep ahead of current trends in DevOps and being able to explain these to technical and business stakeholders.',
        "Worked across a range of technologies and patterns, dependent upon the client's skill set and experience. The role was split between architecture and planning, hands-on technical and stakeholder management.",
        'Provided technical leadership, both amongst the Foundry4 team and client team, running structured and ad-hoc training sessions. These were focused on the new patterns and workflows being implemented as part of the programme the consultancy was engaged in delivering but often covered additional topics as necessary.',
        'Kubernetes and GitOps was a regular feature of the work delivered but included many different features of the cloud providers used. There was a strong focus on automation, self-service, reliability and monitoring.',
      ],
      skills: [
        'Azure',
        'Google Cloud Platform',
        'Serverless',
        'OpenFaaS',
        'Terraform',
        'Kubernetes',
        'Helm',
        'GitOps',
        'Automation',
        'CI/CD',
        'Semantic Release',
        'NodeJS',
        'PHP',
        'R',
        'Python',
        'Architecture',
      ],
    },
    {
      company: 'Energy Systems Catapult',
      position: 'Platform Engineer (contract)',
      website: 'https://es.catapult.org.uk',
      startDate: new Date(2016, 10, 1),
      endDate: new Date(2019, 7, 1),
      summary: `Inherited an undocumented codebase from a third-party, including an unsupported
proprietary graph database and worked to achieve a stable platform to provide domestic heating for
trials involving 30 and 100 homes.`,
      highlights: [
        `Working within tight constraints I developed key components for the system that would
ensure a standard of reliability to safeguard all users, particularly those vulnerable to
downtime.`,
        `Developed strong working relationships with key members of different teams to fully
understand real-world issues with the applications and established proposals to address them.`,
        `Worked with the data science team to provide an additional software resource especially
with R, Spark and Cassandra, technologies I was previously unfamiliar with.`,
        `Took responsibilities as interim scrum master when the need arose and managed interactions
with third-party development partners.`,
        'Encouraged use of best practice, especially amongst junior developers mentored.',
      ],
      skills: [
        'NodeJS',
        'Angular',
        'Python',
        'R',
        'MongoDB',
        'PostgreSQL',
        'GraphDB',
        'Docker',
        'Kubernetes',
        'Spark',
        'Kafka',
        'IoT',
        'Hardware',
        'AWS',
        'Automation',
        'MicroServices',
      ],
    },
    {
      company: 'Cromwell Tools',
      position: 'Lead Engineer (contract)',
      website: 'https://www.cromwell.co.uk',
      startDate: new Date(2016, 0, 1),
      endDate: new Date(2016, 3, 1),
      summary: `Led the NodeJS development team on a replacement API for the main website, which
had to maintain backwards compatibility with the existing website.`,
      highlights: [
        'Established weekly workshops to educate the team on best practice in NodeJS and MongoDB.',
        `Managed the sprints and the whole agile process. The teams were spread across three
different locations and, initially, the communication was poor. Improved this by tightening the
agile disciplines.`,
        `Encouraged the adoption of microservices for admin processes. Proposed an architectural
design for this solution and implemented it.`,
      ],
      skills: [
        'NodeJS',
        'ES6',
        'TypeScript',
        'MongoDB',
        'AWS',
        'Docker',
        'RabbitMQ',
        'Automation',
        'Workshops',
        'Leadership',
        'Solutions Design',
      ],
    },
    {
      company: 'CDG Group',
      position: 'Senior Software Engineer (contract)',
      website: 'https://groupcdg.com',
      startDate: new Date(2015, 9, 1),
      endDate: new Date(2016, 0, 1),
      summary: `Brought in to provide Angular and D3 expertise. As a pure Java house, they had
limited knowledge of front-end JavaScript. Improved their usage to provide a more consistent and an
easier development experience.`,
      highlights: [
        `Rewrote the front-end for their main Lean Client product. Although marketed as a single
application, in reality it was a suite of software. Configured this to build to a Docker image`,
        `Created a Yeoman generator for fast construction of new AngularJS modules. This was partly
to enforce consistency, but to help the Java engineers gain familiarity in JavaScript.`,
        `Developed a comprehensive form generator to enable the API to generate a schema that would
display the user input in a consistent way.`,
        `Provided training to the Java engineers on how to use JavaScript, Angular and their
associated ecosystems and how to develop and deploy with the module framework I developed.`,
      ],
      skills: ['NodeJS', 'JavaScript', 'ES6', 'AngularJS', 'D3', 'Automation', 'SocketIO'],
    },
    {
      company: 'Wealth Wizards',
      position: 'Senior Software Engineer (contract)',
      website: 'https://www.wealthwizards.com/',
      startDate: new Date(2014, 8, 1),
      endDate: new Date(2015, 4, 1),
      summary: `Developed both front and back-end components as part of a team that created an
automated pension advice system.`,
      highlights: [
        `Collaborated to design and implement a Data Definition Language for the PHP back-end to
publish a comprehensive question schema. This schema would be ingested by the Angular front-end to
dynamically generate the form, which could be defined on a per-broker basis.`,
        'Built a series of reusable Angular components to be used across the platform.',
        `Developed a PDF report generator for the broker's advice to be displayed with D3
infographics. Worked closely with the firm's pension advisers to ensure accurate and FCA compliant
reports.`,
      ],
      skills: ['NodeJS', 'PHP', 'AngularJS', 'D3', 'Automation', 'MongoDB'],
    },
    {
      company: 'GeoPost (now DPD UK)',
      position: 'Senior Software Engineer',
      website: 'https://dpd.co.uk',
      startDate: new Date(2012, 9, 1),
      endDate: new Date(2014, 7, 1),
      summary: `Worked on the main DPD/Interlink RESTful API. Written in pure NodeJS, this
business-critical service was responsible for handling requests for web users, depot operations and
receiving batch data from senders.`,
      highlights: [
        `Implemented continuous integration principles to the development workflow. Due to the
company being a round-the-clock operation,  worked with the SysOps team to reduce the time required
for software upgrades.`,
        `Principal engineer on the industry-leading Follow My Parcel service, which included being
part of the team that designed the architecture. The primary problem was that the current system was
not designed for real-time tracking as the central database was monolithic and unscalable. The
design and implementation needed to encompass methods of achieving live updates without huge expense
or causing service outage. This was the flagship project that year and a major USP for the company,
whilst handling a large increase in daily requests - ~700,000 and ~900,000 on Xbox One and PS4
launch days respectively.`,
        `Wrote a pure JavaScript driver for the Rocket UniVerse NoSQL database. As UniVerse is a
proprietary piece of software with little public documentation available, this required reverse
engineering the Java driver and translating into NodeJS. As a fundamental piece of the live tracking
architecture, this reliably handles millions of requests per day.`,
        `Ran training sessions to upskill non-JS developers to be proficient in the NodeJS
platform.`,
      ],
      skills: ['NodeJS', 'MongoDB', 'MySQL', 'Rocket UniVerse', 'Automation', 'Workshops'],
    },
    {
      company: 'Torpedo Group',
      position: 'Web Developer (contract)',
      website: 'https://torpedogroup.com',
      startDate: new Date(2012, 2, 1),
      endDate: new Date(2012, 8, 1),
      highlights: [
        'Built various websites using the MODX content management system.',
        `Created a business analytics system for major clients to track engagers of their sites and
social media accounts.`,
        `Made extensive use of responsive web design and Twitter Bootstrap to create mobile-first
pages.`,
      ],
      skills: ['PHP', 'MODX', 'MySQL', 'Mobile Development'],
    },
    {
      company: 'BugFinders',
      position: 'Lead Developer',
      website: 'https://www.bugfinders.com',
      startDate: new Date(2011, 2, 1),
      endDate: new Date(2012, 1, 1),
      highlights: [
        `Built the alpha-release of the BugFinders project, featuring complexities such as a
streaming video server, internationalization and responsive mobile site.`,
        `Also responsible for managing the development team, liaising with external suppliers and
helping develop the business proposition.`,
        `The main development was in PHP/MySQL, however there was a great deal of time spent
learning new technologies (such as OAuth, Java and Python) and learning testing methodologies.`,
      ],
      skills: ['PHP', 'MySQL', 'Solutions Design'],
    },
    {
      company: 'Big Eye Deers',
      position: 'PHP Developer (contract)',
      website: 'https://www.bigeyedeers.co.uk',
      startDate: new Date(2010, 11, 1),
      endDate: new Date(2011, 2, 1),
      highlights: [
        `Lead development of the new British Pathé website, featuring over 90,000 videos and a
large database schema.`,
        `As well has being involved with the planning and building of the project, I learnt how to
use Apache Solr which, at the time, was largely undocumented and entirely unused in a PHP
environment.`,
      ],
      skills: ['PHP', 'MySQL', 'Apache Solr', 'Leadership', 'Solutions Design'],
    },
    {
      company: 'Red Procurement',
      position: 'Platform Programmer (contract)',
      startDate: new Date(2010, 6, 1),
      endDate: new Date(2010, 9, 1),
      highlights: [
        `Designed and built Streamline, a purpose-built tool to aid procurement managers track their
   workflow and costs and for directors to see company-wide trends.`,
        `Due to the sensitive nature of the data generated, one requirement was for this project was
for it to be deployable on both Windows and Linux servers, connecting to MySQL or MS-SQL databases.
Using Doctrine ORM to abstract the data stores and heavy use of unit testing to ensure consistency
achieved this.`,
      ],
      skills: ['PHP', 'MySQL', 'MS-SQL', 'Doctrine', 'Solutions Design'],
    },
    {
      company: 'Maverick Television',
      position: 'Platform Developer',
      website: 'https://mavericktv.co.uk',
      startDate: new Date(2010, 0, 1),
      endDate: new Date(2010, 5, 1),
      highlights: [
        'Developed a bespoke CMS for a multi-million pound NHS project using the Zend framework.',
        `The platform made heavy use of video integration and web services from various NHS and
third-party sources.`,
      ],
      skills: ['PHP', 'MySQL', 'Zend'],
    },
    {
      company: 'Richmond Group',
      position: 'PHP Developer (contract)',
      website: 'https://www.therichmondgroup.co.uk/',
      startDate: new Date(2009, 10, 1),
      endDate: new Date(2010, 0, 1),
      highlights: [
        `Fire-fighting role doing emergency updates on the business-critical Loanfinder.co.uk
website.`,
        `For longer-term stability, implemented various structural improvements to the development
team. These included a full version control, a standardised development environment, test-driven
development and formal programming standards.`,
      ],
      skills: ['PHP', 'MySQL'],
    },
    {
      company: 'NamesCo',
      position: 'PHP Developer (contract)',
      website: 'https://names.co.uk',
      startDate: new Date(2009, 2, 1),
      endDate: new Date(2009, 8, 1),
      highlights: [
        'Headed development of a complex ecommerce system with a team of five developers.',
        `The software was built on an extensible in-house object orientated framework to which I
made various critical updates.`,
      ],
      skills: ['PHP', 'MySQL', 'Leadership'],
    },
    {
      company: 'Real Ale Shop',
      position: 'PHP Developer',
      startDate: new Date(2007, 8, 1),
      endDate: new Date(2008, 5, 1),
      summary: 'Developed an ecommerce system for drop-shipping start-up.',
      skills: ['PHP', 'MySQL'],
    },
    {
      company: 'Northwick Events',
      position: 'PHP Developer',
      startDate: new Date(2006, 3, 1),
      endDate: new Date(2008, 7, 1),
      summary: `Developed an admin system for an events management company, to automate much of the
company's admin processes.`,
      skills: ['PHP', 'MySQL'],
    },
  ],
};
