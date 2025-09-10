// Student Sidebar Links
export const StudentSidebarLinks = [
    {
        imageURL: '../imges/house-solid.svg',
        label: 'Home',
        route: '/student/home'
    },
    {
        imageURL: '../imges/magnifying-glass-solid.svg',
        label: 'Activities',
        route: '/student/activities'
    },
    {
        imageURL: '../imges/square-plus-solid.svg',
        label: 'Upload Documents',
        route: '/student/upload'
    },
    {
        imageURL: '../imges/image-solid.svg',
        label: 'Announcements',
        route: '/student/announcements'
    },
    {
        imageURL: '../imges/image-solid.svg',
        label: 'Settings',
        route: '/settings'
    },
];

// Faculty Sidebar Links
export const FacultySidebarLinks = [
    {
        imageURL: '../imges/house-solid.svg',
        label: 'Home',
        route: '/faculty/home'
    },
    {
        imageURL: '../imges/magnifying-glass-solid.svg',
        label: 'Pending Approvals',
        route: '/faculty/pending-approvals'
    },
    {
        imageURL: '../imges/square-plus-solid.svg',
        label: 'Recent Verifications',
        route: '/faculty/recent-verifications'
    },
    {
        imageURL: '../imges/image-solid.svg',
        label: 'Announcements',
        route: '/faculty/announcements'
    },
    {
        imageURL: '../imges/image-solid.svg',
        label: 'Settings',
        route: '/settings'
    },
];

// Student Bottom Bar Links (Mobile)
export const StudentBottombarLinks = [
    {
        imageURL: '../imges/house-solid.svg',
        label: 'Home',
        route: '/student/home'
    },
    {
        imageURL: '../imges/magnifying-glass-solid.svg',
        label: 'Activities',
        route: '/student/activities'
    },
    {
        imageURL: '../imges/square-plus-solid.svg',
        label: 'Upload',
        route: '/student/upload'
    },
    {
        imageURL: '../imges/image-solid.svg',
        label: 'Announcements',
        route: '/student/announcements'
    }
];

// Faculty Bottom Bar Links (Mobile)
export const FacultyBottombarLinks = [
    {
        imageURL: '../imges/house-solid.svg',
        label: 'Home',
        route: '/faculty/home'
    },
    {
        imageURL: '../imges/magnifying-glass-solid.svg',
        label: 'Approvals',
        route: '/faculty/pending-approvals'
    },
    {
        imageURL: '../imges/square-plus-solid.svg',
        label: 'Verifications',
        route: '/faculty/recent-verifications'
    },
    {
        imageURL: '../imges/image-solid.svg',
        label: 'Announcements',
        route: '/faculty/announcements'
    }
];

// Legacy exports for backward compatibility
export const SidebarLinks = StudentSidebarLinks;
export const BottombarLinks = StudentBottombarLinks;