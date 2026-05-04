import { Code2, Globe } from "lucide-react";

interface Props {
  loadingProvider?: "google" | "github" | null;
  onGoogleClick?: () => void;
  onGithubClick?: () => void;
}

export const OAuthButtons = ({
  loadingProvider,
  onGoogleClick,
  onGithubClick,
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:gap-2">
      <button
        onClick={onGoogleClick}
        disabled={!!loadingProvider}
        className="w-full flex items-center justify-center gap-2 bg-muted py-2 rounded-sm group "
      >
        {loadingProvider === "google" ? (
          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Globe size={18} className="group-hover:rotate-180 transition duration-300 ease-in" />
        )}
        Google
      </button>

      <button
        onClick={onGithubClick}
        disabled={!!loadingProvider}
        className="w-full flex items-center justify-center gap-2 bg-muted py-2 rounded-sm group"
      >
        {loadingProvider === "github" ? (
          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Code2 size={18} className="group-hover:transform-[rotateY(180deg)] transition duration-300 ease-in" />
        )}
        GitHub
      </button>
    </div>
  );
};
