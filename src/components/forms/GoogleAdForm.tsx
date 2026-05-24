"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import {
  GoogleAdContent,
  GoogleHeadline,
  GoogleDescription,
  HeadlinePosition,
  DescriptionPosition,
  CHAR_LIMITS,
} from "@/lib/types";
import TextField from "./shared/TextField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusIcon, PinIcon } from "lucide-react";

interface GoogleAdFormProps {
  data: GoogleAdContent;
  onChange: (data: GoogleAdContent) => void;
}

const MIN_HEADLINES = 3;
const MAX_HEADLINES = 15;
const MIN_DESCRIPTIONS = 1;
const MAX_DESCRIPTIONS = 4;

export default function GoogleAdForm({ data, onChange }: GoogleAdFormProps) {
  const { t, locale } = useI18n();
  const limits = CHAR_LIMITS.google;

  // Progressive disclosure: track how many extra fields the user has opened
  const filledHeadlineCount = data.headlines.filter((h) => h.text).length;
  const filledDescCount = data.descriptions.filter((d) => d.text).length;

  const [visibleHeadlines, setVisibleHeadlines] = useState(
    Math.max(MIN_HEADLINES, filledHeadlineCount)
  );
  const [visibleDescriptions, setVisibleDescriptions] = useState(
    Math.max(MIN_DESCRIPTIONS, filledDescCount)
  );

  const updateHeadline = (
    index: number,
    field: keyof GoogleHeadline,
    value: string | HeadlinePosition
  ) => {
    const updated = [...data.headlines];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, headlines: updated });
  };

  const updateDescription = (
    index: number,
    field: keyof GoogleDescription,
    value: string | DescriptionPosition
  ) => {
    const updated = [...data.descriptions];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, descriptions: updated });
  };

  const addHeadline = () => {
    if (visibleHeadlines < MAX_HEADLINES) {
      setVisibleHeadlines((v) => v + 1);
    }
  };

  const addDescription = () => {
    if (visibleDescriptions < MAX_DESCRIPTIONS) {
      setVisibleDescriptions((v) => v + 1);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* URL Section */}
      <section>
        <SectionHeader title={t.google.urlSection} />
        <div className="mt-4">
          <TextField
            label={t.google.companyUrl}
            value={data.companyUrl}
            onChange={(v) => onChange({ ...data, companyUrl: v })}
            placeholder="www.example.co.il"
            required
          />
        </div>
      </section>

      {/* Display Path Section */}
      <section>
        <SectionHeader
          title={t.google.displayPathSection}
          hint={t.google.displayPathHint}
        />
        <div className="mt-4 grid grid-cols-2 gap-4">
          <TextField
            label={t.google.displayPath1}
            value={data.displayPath1}
            onChange={(v) => onChange({ ...data, displayPath1: v })}
            maxChars={limits.displayPath}
            optional
          />
          <TextField
            label={t.google.displayPath2}
            value={data.displayPath2}
            onChange={(v) => onChange({ ...data, displayPath2: v })}
            maxChars={limits.displayPath}
            optional
          />
        </div>
      </section>

      {/* Headlines Section */}
      <section>
        <SectionHeader
          title={t.google.headlinesSection}
          hint={t.google.headlinesHint}
          count={`${filledHeadlineCount}/${MAX_HEADLINES}`}
        />
        <div className="mt-4 flex flex-col gap-3">
          {data.headlines.slice(0, visibleHeadlines).map((headline, i) => (
            <FieldRow
              key={i}
              field={
                <TextField
                  label={`${t.google.headline} ${i + 1}`}
                  value={headline.text}
                  onChange={(v) => updateHeadline(i, "text", v)}
                  maxChars={limits.headline}
                  required={i < MIN_HEADLINES}
                  optional={i >= MIN_HEADLINES}
                  compact
                />
              }
              position={
                <PositionSelect
                  value={headline.position}
                  onChange={(v) =>
                    updateHeadline(i, "position", v as HeadlinePosition)
                  }
                  options={[1, 2, 3]}
                  unpinnedLabel={t.google.unpinned}
                />
              }
            />
          ))}
        </div>

        {visibleHeadlines < MAX_HEADLINES && (
          <Button
            type="button"
            onClick={addHeadline}
            variant="ghost"
            size="sm"
            className="mt-3 text-primary hover:bg-primary/5 hover:text-primary"
          >
            <PlusIcon className="size-3.5" />
            {t.google.headline} {visibleHeadlines + 1}
            <span className="text-muted-foreground">
              ({visibleHeadlines}/{MAX_HEADLINES})
            </span>
          </Button>
        )}
      </section>

      {/* Descriptions Section */}
      <section>
        <SectionHeader
          title={t.google.descriptionsSection}
          hint={t.google.descriptionsHint}
          count={`${filledDescCount}/${MAX_DESCRIPTIONS}`}
        />
        <div className="mt-4 flex flex-col gap-3">
          {data.descriptions
            .slice(0, visibleDescriptions)
            .map((desc, i) => (
              <FieldRow
                key={i}
                field={
                  <TextField
                    label={`${t.google.description} ${i + 1}`}
                    value={desc.text}
                    onChange={(v) => updateDescription(i, "text", v)}
                    maxChars={limits.description}
                    multiline
                    rows={2}
                    required={i < MIN_DESCRIPTIONS}
                    optional={i >= MIN_DESCRIPTIONS}
                    compact
                  />
                }
                position={
                  <PositionSelect
                    value={desc.position}
                    onChange={(v) =>
                      updateDescription(i, "position", v as DescriptionPosition)
                    }
                    options={[1, 2]}
                    unpinnedLabel={t.google.unpinned}
                  />
                }
              />
            ))}
        </div>

        {visibleDescriptions < MAX_DESCRIPTIONS && (
          <Button
            type="button"
            onClick={addDescription}
            variant="ghost"
            size="sm"
            className="mt-3 text-primary hover:bg-primary/5 hover:text-primary"
          >
            <PlusIcon className="size-3.5" />
            {t.google.description} {visibleDescriptions + 1}
            <span className="text-muted-foreground">
              ({visibleDescriptions}/{MAX_DESCRIPTIONS})
            </span>
          </Button>
        )}
      </section>
    </div>
  );
}

// Layout helper - keeps field + position select properly aligned via CSS grid
function FieldRow({ field, position }: { field: React.ReactNode; position: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-end gap-3">
      <div className="min-w-0">{field}</div>
      <div className="pb-[2px]">{position}</div>
    </div>
  );
}

// --- Sub-components ---

function SectionHeader({
  title,
  hint,
  count,
}: {
  title: string;
  hint?: string;
  count?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
          {title}
        </h3>
        {count && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold tabular-nums text-primary">
            {count}
          </span>
        )}
      </div>
      {hint && (
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

function PositionSelect({
  value,
  onChange,
  options,
  unpinnedLabel,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  options: number[];
  unpinnedLabel: string;
}) {
  return (
    <Select
      value={value === null ? "auto" : String(value)}
      onValueChange={(v) => onChange(v === "auto" ? null : Number(v))}
    >
      <SelectTrigger
        className="h-9 w-[90px] gap-1.5 text-xs data-[placeholder]:text-muted-foreground"
        aria-label="Position"
      >
        <PinIcon className={`size-3 ${value !== null ? "text-primary" : "text-muted-foreground"}`} />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto" className="text-xs">{unpinnedLabel}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={String(o)} className="text-xs">
            #{o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
