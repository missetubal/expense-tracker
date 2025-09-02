import { useState, type InputHTMLAttributes, forwardRef } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { label, type, ...rest } = props;
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <label htmlFor={props.id} className='text-[13px] text-slate-800'>
        {label}
      </label>
      <div className='input-box'>
        <input
          className='w-full bg-transparent outline-none'
          type={
            type === 'password' ? (showPassword ? 'text' : 'password') : type
          }
          ref={ref}
          {...rest}
        />
        {type === 'password' && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                className='text-primary cursor-pointer'
                onClick={() => togglePassword()}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className='text-slate-400 cursor-pointer'
                onClick={() => togglePassword()}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
});
