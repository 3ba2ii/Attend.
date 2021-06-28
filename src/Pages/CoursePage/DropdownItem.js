import { useContext } from 'react';
import { DropdownMenuContext } from './DropdownMenu';

export function DropdownItem({
  goToMenu,
  leftIcon,
  rightIcon,
  onSelectAction,
  children,
}) {
  const { setActiveMenu } = useContext(DropdownMenuContext);
  return (
    <a
      href='#'
      className='menu-item'
      onClick={() => {
        goToMenu && setActiveMenu(goToMenu);
        onSelectAction && onSelectAction();
      }}
    >
      {leftIcon && <span className='icon-button'>{leftIcon}</span>}
      {children}
      {rightIcon && <span className='icon-right'>{rightIcon}</span>}
    </a>
  );
}
