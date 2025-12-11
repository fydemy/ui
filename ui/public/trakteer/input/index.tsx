import '../index.css';
import './index.css';

import { forwardRef } from 'react';

type InputProps = {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  variant?: 'default' | 'error' | 'success';
  disabled?: boolean;
  readonly?: boolean;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = 'text', placeholder, value, defaultValue, variant = 'default', disabled = false, readonly = false, label, helperText, errorMessage, icon, iconPosition = 'left', className = '', onChange, onFocus, onBlur, ...props }, ref) => {
    const hasError = variant === 'error' || errorMessage;
    const hasSuccess = variant === 'success';
    const displayVariant = hasError ? 'error' : hasSuccess ? 'success' : 'default';

    return (
      <div className={`input-wrapper ${className}`} data-theme="trakteer">
        {label && (
          <label className="input-label" htmlFor={props.id}>
            {label}
          </label>
        )}
        <div className="input-container">
          {icon && iconPosition === 'left' && <span className="input-icon input-icon-left">{icon}</span>}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            readOnly={readonly}
            data-variant={displayVariant}
            className="input"
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={errorMessage || helperText ? `${props.id || 'input'}-helper` : undefined}
            {...props}
          />
          {icon && iconPosition === 'right' && <span className="input-icon input-icon-right">{icon}</span>}
        </div>
        {(errorMessage || helperText) && (
          <span id={`${props.id || 'input'}-helper`} className={`input-helper ${hasError ? 'input-helper-error' : ''}`}>
            {errorMessage || helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
