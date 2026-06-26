import {createFailedOperation} from "../failedOperation/failedOperationCreator.js";

export const executeRetryable = async ({
    operation,
    operationType,
    payload
}) => {

    try {
        console.log("Inside execute retryable util logic try block");

        return await operation();

    }
    catch(error){
        
        console.log("Inside execute retryable util logic catch block");
        console.log("Error: ", error)

        await createFailedOperation({

            operationType,
            payload,
            error

        });

        console.log("Failed Operation created fro: ", operationType, payload);

        return null;

    }

}