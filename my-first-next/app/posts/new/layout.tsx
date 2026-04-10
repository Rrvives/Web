export default function NewPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`[data-site-header="true"]{display:none !important;}`}</style>
      {children}
    </>
  );
}
