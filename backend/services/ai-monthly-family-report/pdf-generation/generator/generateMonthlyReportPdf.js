import path from "path";
import { fileURLToPath } from "url";
import pdfmake from "pdfmake";

import { buildDocumentDefinition } from "../builders/monthlyReportDocument.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


pdfmake.addFonts({
    Roboto: {
        normal: path.join(
            __dirname,
            "../../../../node_modules/pdfmake/fonts/Roboto/Roboto-Regular.ttf"
        ),
        bold: path.join(
            __dirname,
            "../../../../node_modules/pdfmake/fonts/Roboto/Roboto-Medium.ttf"
        ),
        italics: path.join(
            __dirname,
            "../../../../node_modules/pdfmake/fonts/Roboto/Roboto-Italic.ttf"
        ),
        bolditalics: path.join(
            __dirname,
            "../../../../node_modules/pdfmake/fonts/Roboto/Roboto-MediumItalic.ttf"
        )
    }
});



export const generateMonthlyReportPdf = async ({reportData,aiReport,outputPath}) => {
    try {

        const docDefinition = buildDocumentDefinition( reportData, aiReport );

        const pdf = pdfmake.createPdf(docDefinition);
        

        await pdf.write(outputPath);

        console.log(`PDF generated: ${outputPath}`);

        return true;

    } catch (error) {

        console.error("Failed to generate PDF:", error);

        throw error;
    }
};