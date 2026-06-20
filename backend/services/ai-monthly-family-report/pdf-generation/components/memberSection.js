export const buildMemberSection =
    (reportData) => {

        return [

            {
                text:
                    "Member Contributions",
                style:
                    "sectionTitle"
            },

            {
                table: {

                    widths: [
                        "*",
                        "auto",
                        "auto"
                    ],

                    body: [

                        [
                            "Member",
                            "Amount",
                            "Share"
                        ],

                        ...reportData.memberHistory
                            .map(member => {

                                const latest =
                                    member
                                        .monthlyAmounts
                                        .at(-1);

                                return [

                                    member.member,

                                    latest.amount,

                                    `${latest.shareOfFamilyExpense}%`
                                ];
                            })
                    ]
                }
            }
        ];
    };