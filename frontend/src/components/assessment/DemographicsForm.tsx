import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { ApiDemographics } from '../../lib/api';

interface DemographicsFormProps {
  onSubmit: (demographics: ApiDemographics) => void;
}

type GenderOption = 'male' | 'female';
type DietOption = 'vegetarian' | 'non_vegetarian' | 'vegan';
type WorkOption = 'desk' | 'physical' | 'creative' | 'mixed';
type SleepOption = 'good' | 'average' | 'poor';

function PillButton<T extends string>({
  value,
  label,
  selected,
  onSelect,
}: {
  value: T;
  label: string;
  selected: boolean;
  onSelect: (value: T) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border ${
        selected
          ? 'metallic-gold text-[#402d00] border-transparent shadow-lg'
          : 'bg-[#1c1b1b] text-[#d3c5ae] border-[#4f4634]/30 hover:border-[#f6be39]/40 hover:text-[#f6be39]'
      }`}
    >
      {label}
    </button>
  );
}

export function DemographicsForm({ onSubmit }: DemographicsFormProps) {
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState<GenderOption | null>(null);
  const [diet, setDiet] = useState<DietOption | null>(null);
  const [workNature, setWorkNature] = useState<WorkOption | null>(null);
  const [sleepQuality, setSleepQuality] = useState<SleepOption | null>(null);

  const isValid = age !== null && age >= 18 && age <= 100 && gender && diet && workNature && sleepQuality;

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({
      age: age!,
      gender: gender!,
      diet: diet!,
      work_nature: workNature!,
      sleep_quality: sleepQuality!,
    });
  };

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-[#2a2a2a] rounded-3xl border border-[#4f4634]/20 shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-2 text-[#e5e2e1] font-['Plus_Jakarta_Sans']">
            A Little About You
          </h2>
          <p className="text-center text-sm mb-8 text-[#d3c5ae]">
            This helps us personalize your insights
          </p>

          <div className="space-y-6">
            {/* Age */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-[#d3c5ae]">
                Your Age
              </label>
              <input
                type="number"
                min={18}
                max={100}
                placeholder="e.g. 28"
                value={age ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setAge(val ? parseInt(val, 10) : null);
                }}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#f6be39] bg-[#1c1b1b] border border-[#4f4634]/30 text-[#e5e2e1] placeholder:text-[#9b8f7a]"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-[#d3c5ae]">
                Gender
              </label>
              <div className="flex gap-3">
                <PillButton value="male" label="Male" selected={gender === 'male'} onSelect={setGender} />
                <PillButton value="female" label="Female" selected={gender === 'female'} onSelect={setGender} />
              </div>
            </div>

            {/* Diet */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-[#d3c5ae]">
                Diet
              </label>
              <div className="flex flex-wrap gap-3">
                <PillButton value="vegetarian" label="Vegetarian" selected={diet === 'vegetarian'} onSelect={setDiet} />
                <PillButton value="non_vegetarian" label="Non-Vegetarian" selected={diet === 'non_vegetarian'} onSelect={setDiet} />
                <PillButton value="vegan" label="Vegan" selected={diet === 'vegan'} onSelect={setDiet} />
              </div>
            </div>

            {/* Work Nature */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-[#d3c5ae]">
                Work Nature
              </label>
              <div className="flex flex-wrap gap-3">
                <PillButton value="desk" label="Desk/Mental" selected={workNature === 'desk'} onSelect={setWorkNature} />
                <PillButton value="physical" label="Physical" selected={workNature === 'physical'} onSelect={setWorkNature} />
                <PillButton value="creative" label="Creative" selected={workNature === 'creative'} onSelect={setWorkNature} />
                <PillButton value="mixed" label="Mixed" selected={workNature === 'mixed'} onSelect={setWorkNature} />
              </div>
            </div>

            {/* Sleep Quality */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-[#d3c5ae]">
                Sleep Quality
              </label>
              <div className="flex gap-3">
                <PillButton value="good" label="Good" selected={sleepQuality === 'good'} onSelect={setSleepQuality} />
                <PillButton value="average" label="Average" selected={sleepQuality === 'average'} onSelect={setSleepQuality} />
                <PillButton value="poor" label="Poor" selected={sleepQuality === 'poor'} onSelect={setSleepQuality} />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`w-full mt-8 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all duration-200 ${
              isValid
                ? 'metallic-gold text-[#402d00] shadow-xl hover:shadow-[#f6be39]/20 hover:shadow-2xl active:scale-95 cursor-pointer'
                : 'bg-[#1c1b1b] text-[#9b8f7a] border border-[#4f4634]/30 cursor-not-allowed'
            }`}
          >
            Start Quiz
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-center text-xs mt-4 uppercase tracking-wider text-[#d3c5ae]/60">
            Your data is used only to personalize recommendations
          </p>
        </div>
      </div>
    </div>
  );
}
