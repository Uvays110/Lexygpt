import { redirect } from 'next/navigation';
import { DEFAULT_MODEL } from '@/data/models';

export default function PlaygroundIndex() {
  redirect(`/playground/image/${DEFAULT_MODEL.image}`);
}
