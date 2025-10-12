import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class DateValidator {
    static validDate(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) return null;
        // Match YYYY-MM-DD strictly.
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(value)) {
            return { invalidDate: true };
        }
        // Parse the parts.
        const [year, month, day] = value.split('-').map(Number);
        // Check month and day ranges.
        const date = new Date(year, month - 1, day);
        if (
            date.getFullYear() !== year ||
            date.getMonth() + 1 !== month ||
            date.getDate() !== day
        ) {
            return { invalidDate: true };
        }
        return null;
        };
    }
}
