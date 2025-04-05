import './MainButton.css';

export default function MainButton({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <button className='btn' {...props}>
      {children}
    </button>
  );
}
