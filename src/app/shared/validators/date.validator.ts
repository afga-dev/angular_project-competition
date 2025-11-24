import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class DateValidator {
  static validDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      // Validate strict YYYY-MM-DD format
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(value)) {
        return { invalidDate: true };
      }

      // Parse date parts and verify valid month/day ranges
      const [year, month, day] = value.split('-').map(Number);
      const date = new Date(year, month - 1, day);

      // Ensure parsed date matches input values exactly
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
