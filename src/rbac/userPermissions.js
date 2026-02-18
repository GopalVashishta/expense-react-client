import { useSelector } from 'react-redux';

export const ROLE_PERMISSIONS = {
    admin: {
        canCreateUsers: true,
        canUpdateUsers: true,
        canDeleteUsers: true,
        canViewUsers: true,
        canCreateGroups: true,
        canUpdateGroups: true,
        canDeleteGroups: true,
        canViewGroups: true,
        canCreateExpenses: true,
        canViewExpenses: true,
        canUpdateExpenses: true,
        canDeleteExpenses: true,
        canSettleExpenses: true,
    },
    viewer: {
        canCreateUsers: false,
        canUpdateUsers: false,
        canDeleteUsers: false,
        canViewUsers: true,
        canCreateGroups: false,
        canUpdateGroups: false,
        canDeleteGroups: false,
        canViewGroups: true,
        canCreateExpenses: false,
        canViewExpenses: true,
        canUpdateExpenses: false,
        canDeleteExpenses: false,
        canSettleExpenses: false,
    },
    manager: {
        canCreateUsers: false,
        canUpdateUsers: false,
        canDeleteUsers: false,
        canViewUsers: true,
        canCreateGroups: true,
        canUpdateGroups: true,
        canDeleteGroups: false,
        canViewGroups: true,
        canCreateExpenses: true,
        canViewExpenses: true,
        canUpdateExpenses: true,
        canDeleteExpenses: true,
        canSettleExpenses: true,
    }
};

export const usePermissions = () => {
    const user = useSelector((state) => state.userDetails);
    return ROLE_PERMISSIONS[user?.role] || {};
};