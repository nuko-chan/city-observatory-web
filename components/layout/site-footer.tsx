import Image from "next/image";
import { AUTHOR } from "@/lib/constants/author";
import { ExternalLink } from "@/components/ui/external-link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-foreground/10 pt-10 pb-8">
      <div className="grid gap-10 md:grid-cols-3">
        {/* プロフィール */}
        <div className="flex items-start gap-4">
          <Image
            src={AUTHOR.avatarSrc}
            alt="プロフィールアイコン"
            width={64}
            height={64}
            className="h-14 w-14 rounded-full object-cover shadow-[0px_0px_0px_2px_oklch(from_var(--foreground)_l_c_h/10%)]"
          />
          <div>
            <div className="text-sm font-semibold text-foreground">
              {AUTHOR.name}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {AUTHOR.bio}
            </p>
          </div>
        </div>

        {/* リンク */}
        <div>
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.2px] text-muted-foreground">
            Links
          </div>
          <div className="space-y-2">
            {AUTHOR.links.map((link) => (
              <ExternalLink key={link.href} href={link.href}>
                {link.label}
              </ExternalLink>
            ))}
          </div>
        </div>

        {/* 連絡先 */}
        <div>
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.2px] text-muted-foreground">
            Contact
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">
            {AUTHOR.contactMessage}{" "}
            <a
              href={AUTHOR.contactLinkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-4 hover:underline"
            >
              {AUTHOR.contactLinkLabel}
            </a>{" "}
            {AUTHOR.contactSuffix}
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground/60">
        <span>City Observatory</span>
        <span className="font-mono [font-feature-settings:'tnum']">
          &copy; {new Date().getFullYear()} {AUTHOR.name}
        </span>
      </div>
    </footer>
  );
}
