import { ErrorHandler } from '@angular/core';
import Swal from 'sweetalert2';

export class AppErrorHandler implements ErrorHandler {
    handleError(error: any) {
        Swal.fire("There are problem in the connection to the server Please call the administrator", "", "error")
    }
}