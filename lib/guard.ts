export function requireUser(session: any) {
    if (!session || session.user.userType !== "user") {
        throw new Error("USER_ONLY");
    }
}

export function requireAdmin(session: any) {
    if (
        !session ||
        session.user.userType !== "admin" ||
        session.user.adminRole !== "admin"
    ) {
        throw new Error("ADMIN_ONLY");
    }
}

export function requireAdvisor(session: any) {
    if (
        !session ||
        session.user.userType !== "admin" ||
        session.user.adminRole !== "advisor"
    ) {
        throw new Error("ADVISOR_ONLY");
    }
}

//just import requireAdmin(session); when admin only task is being handled ..
//(api endpoint protection)