import React from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'success' | 'danger' | 'icon' | 'iconDanger' | 'iconSuccess' | 'iconAccent';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    fullWidth?: boolean;
    loading?: boolean;
    loadingText?: string;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    fullWidth = false,
    loading = false,
    loadingText = 'Cargando...',
    children,
    className,
    ...props
}) => {
    const baseClasses = "inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses: Record<ButtonVariant, string> = {
        primary: 'bg-primary text-background hover:bg-primary/90 shadow-md',
        outline: 'bg-transparent border border-primary text-primary hover:bg-primary/10',
        ghost: 'bg-transparent text-text-secondary hover:bg-surface hover:text-text-primary',
        success: 'bg-success text-white hover:bg-success/90',
        danger: 'bg-danger text-white hover:bg-danger/90',
        icon: 'p-2 text-text-secondary hover:bg-surface hover:text-primary rounded-full',
        iconDanger: 'p-2 text-danger hover:bg-danger/10 rounded-full',
        iconSuccess: 'p-2 text-success hover:bg-success/10 rounded-full',
        iconAccent: 'p-2 text-accent hover:bg-accent/10 rounded-full'
    };
    
    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                 <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {loadingText}
                </div>
            ) : children}
        </button>
    );
};

export default Button;
