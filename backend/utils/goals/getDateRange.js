// Dates in UTC because mongo stored them in UTC, so while comparing also we will have to do UTC

export const getDateRange = (period) => {
    const now = new Date();

    let start, end;

    if (period === "daily") {
        start = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            0, 0, 0
        ));
        end = now;
    }

    if (period === "weekly") {
        const day = now.getUTCDay();

        const startDate = new Date(now);
        startDate.setUTCDate(now.getUTCDate() - day);

        start = new Date(Date.UTC(
            startDate.getUTCFullYear(),
            startDate.getUTCMonth(),
            startDate.getUTCDate(),
            0, 0, 0
        ));

        end = now;
    }

    if (period === "monthly") {
        start = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            1,
            0, 0, 0
        ));
        end = now;
    }

    if (period === "yearly") {
        start = new Date(Date.UTC(
            now.getUTCFullYear(),
            0,
            1,
            0, 0, 0
        ));
        end = now;
    }

    return { start, end };
};