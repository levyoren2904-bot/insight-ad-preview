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
    <div className="flex flex-col gap-6">
      {/* URL Section */}
      <div>
        <SectionHeader title={t.google.urlSection} />
        <div className="mt-3">
          <TextField
            label={t.google.companyUrl}
            value={data.companyUrl}
            onChange={(v) => onChange({ ...data, companyUrl: v })}
            placeholder="www.example.co.il"
            required
          />
        </div>
      </div>

      {/* Display Path Section */}
      <div>
        <SectionHeader
          title={t.google.displayPathSection}
          hint={t.google.displayPathHint}
        />
        <div className="mt-3 grid grid-cols-2 gap-3">
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
      </div>

      {/* Headlines Section */}
      <div>
        <SectionHeader
          title={t.google.headlinesSection}
          hint={t.google.headlinesHint}
          count={`${filledHeadlineCount}/${MAX_HEADLINES}`}
        />
        <div className="mt-3 flex flex-col gap-2">
          {data.headlines.slice(0, visibleHeadlines).map((headline, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1">
                <TextField
                  label={`${t.google.headline} ${i + 1}`}
                  value={headline.text}
                  onChange={(v) => updateHeadline(i, "text", v)}
                  maxChars={limits.headline}
                  required={i < MIN_HEADLINES}
                  optional={i >= MIN_HEADLINES}
                  compact
                />
              </div>
              <PositionSelect
                value={headline.position}
                onChange={(v) =>
                  updateHeadline(i, "position", v as HeadlinePosition)
                }
                options={[1, 2, 3]}
                label={t.google.position}
                unpinnedLabel={t.google.unpinned}
              />
            </div>
          ))}
        </div>

        {/* Add more button */}
        {visibleHeadlines < MAX_HEADLINES && (
          <button
            type="button"
            onClick={addHeadline}
            className="mt-2 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5 active:scale-[0.98]"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t.google.headline} {visibleHeadlines + 1}
            <span className="text-text-muted">
              ({visibleHeadlines}/{MAX_HEADLINES})
            </span>
          </button>
        )}
      </div>

      {/* Descriptions Section */}
      <div>
        <SectionHeader
          title={t.google.descriptionsSection}
          hint={t.google.descriptionsHint}
          count={`${filledDescCount}/${MAX_DESCRIPTIONS}`}
        />
        <div className="mt-3 flex flex-col gap-2">
          {data.descriptions
            .slice(0, visibleDescriptions)
            .map((desc, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1">
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
                </div>
                <PositionSelect
                  value={desc.position}
                  onChange={(v) =>
                    updateDescription(i, "position", v as DescriptionPosition)
                  }
                  options={[1, 2]}
                  label={t.google.position}
                  unpinnedLabel={t.google.unpinned}
                />
              </div>
            ))}
        </div>

        {visibleDescriptions < MAX_DESCRIPTIONS && (
          <button
            type="button"
            onClick={addDescription}
            className="mt-2 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5 active:scale-[0.98]"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t.google.description} {visibleDescriptions + 1}
            <span className="text-text-muted">
              ({visibleDescriptions}/{MAX_DESCRIPTIONS})
            </span>
          </button>
        )}
      </div>
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
      <div className="flex items-center gap-2">
        <div className="rounded-md bg-primary/10 px-2.5 py-1">
          <span className="text-sm font-bold text-primary">{title}</span>
        </div>
        {count && (
          <span className="text-xs font-medium text-text-muted">{count}</span>
        )}
      </div>
      {hint && (
        <p className="mt-1.5 text-[11px] leading-snug text-text-muted">
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
  label,
  unpinnedLabel,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  options: number[];
  label: string;
  unpinnedLabel: string;
}) {
  return (
    <div className="mt-6 shrink-0">
      <select
        value={value ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? null : Number(v));
        }}
        className="w-[72px] rounded-lg border border-border bg-bg-white px-2 py-[7px] text-xs text-text-secondary outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        title={label}
      >
        <option value="">{unpinnedLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {label} {o}
          </option>
        ))}
      </select>
    </div>
  );
}
