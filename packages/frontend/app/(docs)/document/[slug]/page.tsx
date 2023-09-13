import dynamic from 'next/dynamic';
const TextEditor = dynamic(() => import('@/components/TextEditor'), {
  ssr: false,
});

const document = ({ params }: { params: { slug: string } }) => {
  return <TextEditor slug={params.slug} />;
};

export default document;
