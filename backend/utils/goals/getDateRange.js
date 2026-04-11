export const getDateRange = (period) => {
    const now = new Date();
    let start, end;

    if (period === "daily") {
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date();
    }

    if (period === "weekly") {
        const day = now.getDay();
        start = new Date(now.setDate(now.getDate() - day));
        start.setHours(0, 0, 0, 0);
        end = new Date();
    }

    if (period === "monthly") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date();
    }

    if (period === "yearly") {
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date();
    }

    return { start, end };
};