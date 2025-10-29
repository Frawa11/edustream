import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'url' | 'textarea';
    rows?: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const Input: React.FC<InputProps> = ({ label, id, type = 'text', rows = 3, className, ...props }) => {
    const baseClasses = "w-full px-4 py-2 bg-background border border-border rounded-md text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 transition placeholder:text-text-secondary/50";

    return (
        <div>
            <label htmlFor={id} className="text-sm font-medium text-text-secondary block mb-2">{label}</label>
            {type === 'textarea' ? (
                <textarea
                    id={id}
                    rows={rows}
                    className={`${baseClasses} ${className}`}
                    {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    onChange={props.onChange}
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    className={`${baseClasses} ${className}`}
                    {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                     onChange={props.onChange}
                />
            )}
        </div>
    );
};

export default Input;
