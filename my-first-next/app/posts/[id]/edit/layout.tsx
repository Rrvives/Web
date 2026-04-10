export default function EditPostLayout({
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
