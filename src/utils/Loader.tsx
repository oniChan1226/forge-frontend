import { Loader2 } from "lucide-react";

interface LoaderProps {
  isLoading: boolean;
  loadingText?: string;
  loadedText?: string;
}

const Loader = ({ isLoading, loadingText, loadedText }: LoaderProps) => {
  return (
    <>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {isLoading ? loadingText || "Loading..." : loadedText || "Done"}
    </>
  );
};

export default Loader;
