"use client";

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

export default function GoogleAdForm({ data, onChange }: GoogleAdFormProps) {
  const { t, locale } = useI18n();
  const limits = CHAR_LIMITS.google;

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

  // Find the first empty headline index (for visual separator between required and optional)
  const filledHeadlineCount = data.headlines.filter((h) => h.text).length;
  const filledDescriptionCount = data.descriptions.filter((d) => d.text).length;

  return (
    <div className="flex flex-col gap-6">
      {/* URL Section */}
      <div>
        <SectionHeader
          title={t.google.urlSection}
        />
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
          count={`${filledHeadlineCount}/15`}
        />
        <div className="mt-3 flex flex-col gap-2">
          {data.headlines.map((headline, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1">
                <TextField
                  label={`${t.google.headline} ${i + 1}`}
                  value={headline.text}
                  onChange={(v) => updateHeadline(i, "text", v)}
                  maxChars={limits.headline}
                  required={i < 3}
                  optional={i >= 3}
                  compact
                />
              </div>
              <PositionSelect
                value={headline.position}
                onChange={(v) => updateHeadline(i, "position", v as HeadlinePosition)}
                options={[1, 2, 3]}
                label={t.google.position}
                unpinnedLabel={t.google.unpinned}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Descriptions Section */}
      <div>
        <SectionHeader
          title={t.google.descriptionsSection}
          hint={t.google.descriptionsHint}
          count={`${filledDescriptionCount}/4`}
        />
        <div className="mt-3 flex flex-col gap-2">
          {data.descriptions.map((desc, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1">
                <TextField
                  label={`${t.google.description} ${i + 1}`}
                  value={desc.text}
                  onChange={(v) => updateDescription(i, "text", v)}
                  maxChars={limits.description}
                  multiline
                  required={i < 1}
                  optional={i >= 1}
                  compact
                />
              </div>
              <PositionSelect
                value={desc.position}
                onChange={(v) => updateDescription(i, "position", v as DescriptionPosition)}
                options={[1, 2]}
                label={t.google.position}
                unpinnedLabel={t.google.unpinned}
              />
            </div>
          ))}
        </div>
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
    <div className="flex items-center gap-2">
      <div className="rounded-md bg-primary/10 px-2.5 py-1">
        <span className="text-sm font-bold text-primary">{title}</span>
      </div>
      {count && (
        <span className="text-xs font-medium text-text-muted">{count}</span>
      )}
      {hint && (
        <div className="flex-1">
          <p className="text-[11px] leading-snug text-text-muted">{hint}</p>
        </div>
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
