let currentUser = {};
export const userRole = (JSON.parse(localStorage.getItem('user')) || [{
    userRole: 0
}])

export function changeRole(role){
    userRole.userRole = role;
}

export function auth(de)
