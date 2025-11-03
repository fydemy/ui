import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Sparkles } from "lucide-react";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "@fydemy/ui",
    },
    githubUrl: "https://github.com/@fydemy/ui",
    links: [
      {
        icon: <Sparkles className="fill-neutral-500" />,
        text: "Community",
        url: "https://fydemy.com",
      },
    ],
  };
}
