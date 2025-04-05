import { Button } from '@vkontakte/vkui';

export default function MainButton({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentProps<typeof Button>) {
  return (
    <Button appearance='neutral' {...props}>
      {children}
    </Button>
  );
}
