import Image from "next/image";
import Panel from "@/app/components/ui/Panel";

export default function GameCard({ game, learnMoreLabel }) {
  return (
    <Panel hover className="p-6 h-full flex flex-col">
      <div className="relative w-full mb-4 rounded-lg overflow-hidden bg-bg aspect-[16/9]">
        <Image
          src={game.image}
          alt={game.title}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 55vw, (max-width: 1280px) 40vw, 35vw"
        />
      </div>

      <h4 className="text-lg font-semibold text-center text-text mb-2">{game.title}</h4>

      {game.description && (
        <p className="text-sm text-text-muted text-center whitespace-pre-line flex-grow">{game.description}</p>
      )}

      {game.url && (
        <a
          href={game.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary-300 hover:underline text-center mt-4"
        >
          {learnMoreLabel}
        </a>
      )}
    </Panel>
  );
}
