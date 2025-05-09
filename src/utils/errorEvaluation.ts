import axios from "axios";

const recursiveError = (error: any, returnSet: any) => {
    const childData = error && error.children ? error.children : [];
    if (childData.length > 0) {
        childData.forEach((child: any) => {
            return recursiveError(child, returnSet);
        });
    } else {
        const constraints = error && error.constraints ? error.constraints : {};
        Object.values(constraints).forEach((value: any) => {
            returnSet.add(value);
        });
        return {};
    }
};

const findValidationErrors = (errdata: any) => {
    const returnSet = new Set();
    const errors = errdata && errdata.data ? errdata.data : [];
    if (errors && errors.length > 0) {
        errors.forEach((error: any) => {
            recursiveError(error, returnSet);
        });
    }
    return Array.from(returnSet);
};

const getValidationErrors = (_error: any) => {
    if (axios.isAxiosError(_error)) {
        const error = _error.response?.data;
        const validationErrors = findValidationErrors(error);

        if (validationErrors && validationErrors.length > 0) {
            let errorText = '';
            validationErrors.forEach((value: any) => {
                errorText += value + "\n";
            });
            return errorText;
        } else if (error && error?.friendlyMessage) {
            return error?.friendlyMessage;
        } else if (error && error?.message) {
            return error.message;
        }
        return 'OOPS!!! Something went wrong please try again.';
    }
};

export {
    getValidationErrors
}