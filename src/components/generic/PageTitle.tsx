interface PageTitleProps {
  title: string;
  subtitle: string;
  highlight?: string;
}

export const PageTitle = ({ title, subtitle, highlight }: PageTitleProps) => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold">
        {title}
      </h1>

      {/* 
          flex-wrap: allows wrapping when needed 
          gap-x-2: adds space between subtitle and highlight when on the same line
      */}
      <div className="flex flex-wrap items-baseline text-sm text-muted-foreground">
        <p>{subtitle}</p>
        {highlight && (
          <p className="mt-0.5 md:mt-0">
            {highlight}
          </p>
        )}
      </div>
    </div>
  );
};