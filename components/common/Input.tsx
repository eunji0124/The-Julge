import { useId } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * @description
 * - text, email, password, number, select 타입 지원
 * - email: onBlur 시 형식 검사
 * - password: onBlur 시 길이 검사 (최소 8자) 또는 일치 검사
 * - select: 부모에서 Dropdown 제어, onToggleDropdown과 isDropdownOpen으로 연동
 * - number: unit prop으로 단위 표시
 * - 에러 상태는 부모에서 관리
 * - label prop으로 접근성 향상 (htmlFor, id 자동 연결)
 *
 * @example
 * // 이메일
 * const [email, setEmail] = useState('');
 * const [emailError, setEmailError] = useState('');
 *
 * <Input
 *   type="email"
 *   label="이메일"
 *   value={email}
 *   onChange={setEmail}
 *   error={emailError}
 *   onValidate={(isValid, message) => setEmailError(message)}
 *   placeholder="example@email.com"
 * />
 *
 * // 비밀번호
 * const [password, setPassword] = useState('');
 * const [passwordError, setPasswordError] = useState('');
 *
 * <Input
 *   type="password"
 *   label="비밀번호"
 *   value={password}
 *   onChange={setPassword}
 *   error={passwordError}
 *   onValidate={(isValid, message) => setPasswordError(message)}
 *   placeholder="8자 이상 입력"
 * />
 *
 * // 비밀번호 확인
 * const [passwordConfirm, setPasswordConfirm] = useState('');
 * const [passwordConfirmError, setPasswordConfirmError] = useState('');
 *
 * <Input
 *   type="password"
 *   label="비밀번호 확인"
 *   value={passwordConfirm}
 *   onChange={setPasswordConfirm}
 *   matchValue={password}
 *   error={passwordConfirmError}
 *   onValidate={(isValid, message) => setPasswordConfirmError(message)}
 *   placeholder="비밀번호를 다시 입력"
 * />
 *
 * // 셀렉트 (Dropdown 컴포넌트와 함께 사용)
 * import Dropdown from '@/components/Dropdown';
 *
 * const [category, setCategory] = useState('');
 * const [dropdownOpen, setDropdownOpen] = useState(false);
 * //relative 필수
 * <div className="relative">
 *   <Input
 *     type="select"
 *     label="카테고리"
 *     value={category}
 *     onChange={setCategory}
 *     onToggleDropdown={() => setDropdownOpen(!dropdownOpen)}
 *     isDropdownOpen={dropdownOpen}
 *     placeholder="선택"
 *   />
 *   {dropdownOpen && (
 *     <Dropdown
 *       items={['음식점', '카페', '편의점', '숙박', '기타']}
 *       selected={category}
 *       onSelect={(value) => {
 *         setCategory(value);
 *         setDropdownOpen(false);
 *       }}
 *       onClose={() => setDropdownOpen(false)}
 *     />
 *   )}
 * </div>
 *
 * // 시급
 * const [wage, setWage] = useState('');
 *
 * <Input
 *   type="number"
 *   label="시급"
 *   value={wage}
 *   onChange={setWage}
 *   unit="원"
 *   placeholder="시급을 입력하세요"
 * />
 */

interface InputProps {
  id?: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'select';
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  unit?: string;
  matchValue?: string;
  className?: string;
  onToggleDropdown?: () => void;
  isDropdownOpen?: boolean;
  error?: string;
  onValidate?: (isValid: boolean, errorMessage: string) => void;
  disabled?: boolean;
}

// 공통 스타일 함수
const inputVariants = cva(
  'w-full text-base h-[58px] px-4 py-3 border rounded-lg transition-colors outline-none',
  {
    variants: {
      error: {
        true: 'border-red-40 focus:border-red-40',
        false: 'border-gray-30 focus:border-blue-20',
      },
      hasRightElement: {
        true: 'pr-10',
        false: '',
      },
    },
    defaultVariants: {
      error: false,
      hasRightElement: false,
    },
  }
);

// 검증 함수
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => password.length >= 8;

const validatePasswordMatch = (password: string, confirm: string): boolean =>
  password === confirm;

const Input = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  unit,
  matchValue,
  className,
  onToggleDropdown,
  isDropdownOpen = false,
  error,
  onValidate,
  disabled = false,
}: InputProps) => {
  // ID 생성
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  // onBlur 검증
  const handleBlur = () => {
    if (!onValidate) return;

    // 빈 값 처리
    if (value.trim() === '') {
      onValidate(false, '값을 입력해 주세요.');
      return;
    }

    let isValid = true;
    let errorMessage = '';

    // 타입별 검증
    if (type === 'email') {
      isValid = validateEmail(value);
      errorMessage = isValid ? '' : '이메일 형식으로 작성해 주세요.';
    } else if (type === 'password') {
      if (matchValue !== undefined) {
        isValid = validatePasswordMatch(matchValue, value);
        errorMessage = isValid ? '' : '비밀번호가 일치하지 않습니다.';
      } else {
        isValid = validatePassword(value);
        errorMessage = isValid ? '' : '8자 이상 입력해 주세요.';
      }
    }

    onValidate(isValid, errorMessage);
  };

  const handleClick = () => {
    if (type === 'select') {
      onToggleDropdown?.();
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={type === 'select' ? 'text' : type}
          readOnly={type === 'select'}
          value={value}
          onClick={handleClick}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          aria-haspopup={type === 'select' ? 'listbox' : undefined}
          aria-expanded={type === 'select' ? isDropdownOpen : undefined}
          className={cn(
            inputVariants({
              error: Boolean(error),
              hasRightElement: type === 'select' || Boolean(unit),
            })
          )}
          disabled={disabled}
        />

        {/* Select 타입 화살표*/}
        {type === 'select' && (
          <svg
            className={cn(
              'pointer-events-none absolute top-1/2 right-5 h-2 w-3 -translate-y-1/2 transition-transform',
              isDropdownOpen && 'rotate-180'
            )}
            fill="#111322"
            viewBox="0 0 13 8"
            aria-hidden="true">
            <path d="M7.00324 7.7268L12.6032 1.3268C13.0558 0.809537 12.6885 0 12.0012 0L0.801179 0C0.113852 0 -0.25349 0.809537 0.199118 1.3268L5.79912 7.7268C6.11785 8.09107 6.68451 8.09107 7.00324 7.7268Z" />
          </svg>
        )}

        {/* Number 타입 단위 표시 */}
        {unit && (
          <span
            className="absolute top-1/2 right-5 -translate-y-1/2 text-sm text-black"
            aria-hidden="true">
            {unit}
          </span>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p id={errorId} className="text-red-40 mt-1 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
