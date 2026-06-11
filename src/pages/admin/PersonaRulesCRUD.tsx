import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    GripVertical,
    Save,
    X,
    AlertTriangle,
    CheckCircle2,
    Sparkles,
    ChevronDown,
    ChevronUp,
    RotateCcw,
    Shield,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '../../components/ui/dialog';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { PROGRAM_DATA, type ProgramInfo } from '../../lib/data';

/* ─── Data model ─── */
export interface PersonaRule {
    id: string;
    persona: string;
    displayName: string;
    icon: string;
    description: string;
    traits: string[];
    gradientClass: string;
    programIds: string[];
    logicWeight: number;   // 0-1 weighting for logic dimension
    creativeWeight: number; // 0-1 weighting for creative dimension
    isActive: boolean;
    updatedAt: string;
}

const DEFAULT_RULES: PersonaRule[] = [
    {
        id: 'creator',
        persona: 'creator',
        displayName: 'The Creator',
        icon: '',
        description: 'Passionate about building things from scratch and seeing ideas come alive.',
        traits: ['Creative problem solver', 'User-focused', 'Hands-on builder', 'Design-oriented'],
        gradientClass: 'from-blue-500 to-blue-700',
        programIds: ['graphics-multimedia', 'software-engineering', 'business-analytics'],
        logicWeight: 0.3,
        creativeWeight: 0.7,
        isActive: true,
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'solver',
        persona: 'solver',
        displayName: 'The Problem Solver',
        icon: '',
        description: 'Driven by logic, efficiency, and the satisfaction of solving difficult problems.',
        traits: ['Analytical thinker', 'Detail-oriented', 'Logic-driven', 'Persistent'],
        gradientClass: 'from-red-500 to-red-700',
        programIds: ['software-engineering', 'artificial-intelligence', 'systems-networking'],
        logicWeight: 0.8,
        creativeWeight: 0.2,
        isActive: true,
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'guardian',
        persona: 'guardian',
        displayName: 'The Guardian',
        icon: '️',
        description: 'Motivated by security, protection, and keeping systems safe.',
        traits: ['Security-minded', 'Ethical', 'Vigilant', 'Strategic'],
        gradientClass: 'from-indigo-500 to-indigo-600',
        programIds: ['cybersecurity', 'systems-networking', 'software-engineering'],
        logicWeight: 0.9,
        creativeWeight: 0.1,
        isActive: true,
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'analyst',
        persona: 'analyst',
        displayName: 'The Analyst',
        icon: '',
        description: 'Curious about patterns, trends, and what data can reveal.',
        traits: ['Data-driven', 'Curious', 'Pattern recognizer', 'Research-oriented'],
        gradientClass: 'from-purple-500 to-purple-700',
        programIds: ['business-analytics', 'artificial-intelligence', 'software-engineering'],
        logicWeight: 0.7,
        creativeWeight: 0.3,
        isActive: true,
        updatedAt: new Date().toISOString(),
    },
];

/* ─── Storage helpers ─── */
const STORAGE_KEY = 'myunipath_persona_rules';
// Bump this whenever DEFAULT_RULES is changed in a way that invalidates older cached rules
// (e.g. program ID renames). Existing localStorage entries with a lower version are discarded.
const RULES_VERSION = 2;
const VERSION_KEY = 'myunipath_persona_rules_version';

function loadRules(): PersonaRule[] {
    try {
        const storedVersion = parseInt(localStorage.getItem(VERSION_KEY) ?? '0', 10);
        if (storedVersion >= RULES_VERSION) {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) return JSON.parse(stored);
        } else {
            // Stale schema — clear it so DEFAULT_RULES kicks in with the new IDs.
            localStorage.removeItem(STORAGE_KEY);
        }
    } catch { /* noop */ }
    return DEFAULT_RULES;
}

function saveRules(rules: PersonaRule[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
    localStorage.setItem(VERSION_KEY, String(RULES_VERSION));
}

/* ─── Toast ─── */
interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

function ToastNotification({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
    useEffect(() => {
        const t = setTimeout(onDismiss, 3500);
        return () => clearTimeout(t);
    }, [onDismiss]);

    const bg =
        toast.type === 'success'
            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
            : toast.type === 'error'
                ? 'bg-red-500/15 border-red-500/30 text-red-400'
                : 'bg-blue-500/15 border-blue-500/30 text-blue-400';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-lg shadow-2xl ${bg}`}
        >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 shrink-0" />}
            {toast.type === 'info' && <Sparkles className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={onDismiss} className="ml-auto hover:opacity-60 transition-opacity">
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

/* ─── Gradient preview ─── */
const GRADIENT_OPTIONS = [
    'from-blue-500 to-blue-700',
    'from-red-500 to-red-700',
    'from-indigo-500 to-indigo-600',
    'from-purple-500 to-purple-700',
    'from-emerald-500 to-emerald-700',
    'from-amber-500 to-amber-700',
    'from-pink-500 to-pink-700',
    'from-cyan-500 to-cyan-700',
    'from-rose-500 to-rose-700',
    'from-teal-500 to-teal-700',
];

const ICON_OPTIONS = ['', '', '️', '', '', '', '', '', '', '', '', '', '', '', ''];

/* ─── Confirm Dialog ─── */
function ConfirmDialog({
    open,
    title,
    description,
    onConfirm,
    onCancel,
}: {
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <Dialog open={open} onOpenChange={(v: boolean) => !v && onCancel()}>
            <DialogContent className="bg-card/95 backdrop-blur-xl border-border rounded-2xl shadow-2xl max-w-md">
                <DialogHeader>
                    <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 mx-auto mb-2">
                        <AlertTriangle className="w-7 h-7 text-red-500" />
                    </div>
                    <DialogTitle className="text-center text-foreground">{title}</DialogTitle>
                    <DialogDescription className="text-center">{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-3 sm:flex-row">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                    >
                        Delete
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/* ─── Rule Editor Dialog ─── */
function RuleEditorDialog({
    open,
    rule,
    isNew,
    onSave,
    onClose,
}: {
    open: boolean;
    rule: PersonaRule | null;
    isNew: boolean;
    onSave: (rule: PersonaRule) => void;
    onClose: () => void;
}) {
    const [form, setForm] = useState<PersonaRule>(
        rule ?? {
            id: '',
            persona: '',
            displayName: '',
            icon: '',
            description: '',
            traits: [''],
            gradientClass: GRADIENT_OPTIONS[0],
            programIds: [],
            logicWeight: 0.5,
            creativeWeight: 0.5,
            isActive: true,
            updatedAt: new Date().toISOString(),
        }
    );
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showGradientPicker, setShowGradientPicker] = useState(false);
    const [showIconPicker, setShowIconPicker] = useState(false);

    useEffect(() => {
        if (rule) setForm(rule);
        else
            setForm({
                id: '',
                persona: '',
                displayName: '',
                icon: '',
                description: '',
                traits: [''],
                gradientClass: GRADIENT_OPTIONS[0],
                programIds: [],
                logicWeight: 0.5,
                creativeWeight: 0.5,
                isActive: true,
                updatedAt: new Date().toISOString(),
            });
        setErrors({});
    }, [rule, open]);

    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (!form.persona.trim()) e.persona = 'Persona key is required';
        if (!form.displayName.trim()) e.displayName = 'Display name is required';
        if (!form.description.trim()) e.description = 'Description is required';
        if (form.traits.filter((t) => t.trim()).length === 0) e.traits = 'At least one trait is required';
        if (form.programIds.length === 0) e.programIds = 'Select at least one program';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        onSave({
            ...form,
            id: form.persona.toLowerCase().replace(/\s+/g, '-'),
            traits: form.traits.filter((t) => t.trim()),
            updatedAt: new Date().toISOString(),
        });
    };

    const addTrait = () => setForm((f) => ({ ...f, traits: [...f.traits, ''] }));
    const removeTrait = (idx: number) =>
        setForm((f) => ({ ...f, traits: f.traits.filter((_, i) => i !== idx) }));
    const updateTrait = (idx: number, val: string) =>
        setForm((f) => ({ ...f, traits: f.traits.map((t, i) => (i === idx ? val : t)) }));

    const toggleProgram = (programId: string) => {
        setForm((f) => ({
            ...f,
            programIds: f.programIds.includes(programId)
                ? f.programIds.filter((p) => p !== programId)
                : [...f.programIds, programId],
        }));
    };

    const allPrograms = Object.values(PROGRAM_DATA) as ProgramInfo[];

    return (
        <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
            <DialogContent className="bg-card/95 backdrop-blur-xl border-border rounded-2xl shadow-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-foreground">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${form.gradientClass} flex items-center justify-center text-xl shadow-lg`}>
                            {form.icon}
                        </div>
                        {isNew ? 'Create New Persona Rule' : `Edit: ${form.displayName}`}
                    </DialogTitle>
                    <DialogDescription>
                        {isNew
                            ? 'Define a new rule to map quiz answers to a tech persona.'
                            : 'Modify the persona rule settings, traits, and program mappings.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-2">
                    {/* Row 1: Persona Key + Display Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-foreground mb-1.5 block">Persona Key</label>
                            <input
                                value={form.persona}
                                onChange={(e) => setForm((f) => ({ ...f, persona: e.target.value }))}
                                placeholder="e.g. creator"
                                disabled={!isNew}
                                className={`w-full px-3.5 py-2.5 bg-secondary/50 border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all ${errors.persona ? 'border-red-500' : 'border-border'
                                    } ${!isNew ? 'opacity-60 cursor-not-allowed' : ''}`}
                            />
                            {errors.persona && <p className="text-xs text-red-400 mt-1">{errors.persona}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-foreground mb-1.5 block">Display Name</label>
                            <input
                                value={form.displayName}
                                onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                                placeholder="e.g. The Creator"
                                className={`w-full px-3.5 py-2.5 bg-secondary/50 border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all ${errors.displayName ? 'border-red-500' : 'border-border'
                                    }`}
                            />
                            {errors.displayName && <p className="text-xs text-red-400 mt-1">{errors.displayName}</p>}
                        </div>
                    </div>

                    {/* Row 2: Icon + Gradient */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-foreground mb-1.5 block">Icon</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowIconPicker(!showIconPicker)}
                                    className="w-full px-3.5 py-2.5 bg-secondary/50 border border-border rounded-xl text-foreground flex items-center gap-2 hover:border-primary/50 transition-colors"
                                >
                                    <span className="text-2xl">{form.icon}</span>
                                    <span className="text-sm text-muted-foreground">Click to change</span>
                                    <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground" />
                                </button>
                                {showIconPicker && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute top-full left-0 right-0 mt-1 z-50 bg-card border border-border rounded-xl shadow-xl p-3 grid grid-cols-5 gap-1"
                                    >
                                        {ICON_OPTIONS.map((icon) => (
                                            <button
                                                key={icon}
                                                onClick={() => {
                                                    setForm((f) => ({ ...f, icon }));
                                                    setShowIconPicker(false);
                                                }}
                                                className={`text-2xl p-2 rounded-lg hover:bg-secondary transition-colors ${form.icon === icon ? 'bg-primary/20 ring-2 ring-primary' : ''}`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-foreground mb-1.5 block">Gradient</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowGradientPicker(!showGradientPicker)}
                                    className="w-full px-3.5 py-2.5 bg-secondary/50 border border-border rounded-xl flex items-center gap-3 hover:border-primary/50 transition-colors"
                                >
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${form.gradientClass} shadow-md`} />
                                    <span className="text-sm text-muted-foreground truncate">{form.gradientClass}</span>
                                    <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground shrink-0" />
                                </button>
                                {showGradientPicker && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute top-full left-0 right-0 mt-1 z-50 bg-card border border-border rounded-xl shadow-xl p-3 grid grid-cols-5 gap-2"
                                    >
                                        {GRADIENT_OPTIONS.map((g) => (
                                            <button
                                                key={g}
                                                onClick={() => {
                                                    setForm((f) => ({ ...f, gradientClass: g }));
                                                    setShowGradientPicker(false);
                                                }}
                                                className={`w-full aspect-square rounded-lg bg-gradient-to-br ${g} hover:scale-110 transition-transform shadow-md ${form.gradientClass === g ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : ''
                                                    }`}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-semibold text-foreground mb-1.5 block">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            placeholder="Describe what this persona represents..."
                            rows={3}
                            className={`w-full px-3.5 py-2.5 bg-secondary/50 border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none ${errors.description ? 'border-red-500' : 'border-border'
                                }`}
                        />
                        {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
                    </div>

                    {/* Traits */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-sm font-semibold text-foreground">Traits</label>
                            <button
                                onClick={addTrait}
                                className="text-xs text-primary hover:text-primary/80 font-semibold flex items-center gap-1 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Trait
                            </button>
                        </div>
                        {errors.traits && <p className="text-xs text-red-400 mb-2">{errors.traits}</p>}
                        <div className="space-y-2">
                            {form.traits.map((trait, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                                    <input
                                        value={trait}
                                        onChange={(e) => updateTrait(idx, e.target.value)}
                                        placeholder={`Trait ${idx + 1}`}
                                        className="flex-1 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                    />
                                    {form.traits.length > 1 && (
                                        <button
                                            onClick={() => removeTrait(idx)}
                                            className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Score Weights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-foreground mb-1.5 block">
                                Logic Weight <span className="text-primary font-bold">{form.logicWeight.toFixed(2)}</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={form.logicWeight}
                                onChange={(e) => setForm((f) => ({ ...f, logicWeight: parseFloat(e.target.value) }))}
                                className="w-full accent-primary"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>Low</span>
                                <span>High</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-foreground mb-1.5 block">
                                Creative Weight <span className="text-primary font-bold">{form.creativeWeight.toFixed(2)}</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={form.creativeWeight}
                                onChange={(e) => setForm((f) => ({ ...f, creativeWeight: parseFloat(e.target.value) }))}
                                className="w-full accent-primary"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>Low</span>
                                <span>High</span>
                            </div>
                        </div>
                    </div>

                    {/* Program Mapping */}
                    <div>
                        <label className="text-sm font-semibold text-foreground mb-1.5 block">
                            Program Mapping{' '}
                            <span className="text-muted-foreground font-normal">({form.programIds.length} selected)</span>
                        </label>
                        {errors.programIds && <p className="text-xs text-red-400 mb-2">{errors.programIds}</p>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {allPrograms.map((prog) => {
                                const selected = form.programIds.includes(prog.id);
                                return (
                                    <button
                                        key={prog.id}
                                        onClick={() => toggleProgram(prog.id)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${selected
                                            ? 'bg-primary/10 border-primary/40 shadow-sm shadow-primary/10'
                                            : 'bg-secondary/30 border-border hover:border-primary/30'
                                            }`}
                                    >
                                        <span className="text-xl">{prog.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${selected ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {prog.name}
                                            </p>
                                        </div>
                                        {selected && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border">
                        <div>
                            <p className="text-sm font-semibold text-foreground">Active Status</p>
                            <p className="text-xs text-muted-foreground">Inactive rules are excluded from recommendations</p>
                        </div>
                        <button
                            onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                            className={`relative w-12 h-6 rounded-full transition-colors ${form.isActive ? 'bg-emerald-500' : 'bg-muted'
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${form.isActive ? 'left-6' : 'left-0.5'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                <DialogFooter className="flex gap-3 sm:flex-row pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                    >
                        <X className="w-4 h-4" /> Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" /> {isNew ? 'Create Rule' : 'Save Changes'}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/* ─── Main CRUD Component ─── */
export function PersonaRulesCRUD() {
    const [rules, setRules] = useState<PersonaRule[]>(loadRules);
    const [search, setSearch] = useState('');
    const [editorOpen, setEditorOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<PersonaRule | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<PersonaRule | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [sortField, setSortField] = useState<'persona' | 'updatedAt'>('persona');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
        const id = crypto.randomUUID?.() ?? Date.now().toString();
        setToasts((t) => [...t, { id, message, type }]);
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts((t) => t.filter((x) => x.id !== id));
    }, []);

    // Persist on change
    useEffect(() => {
        saveRules(rules);
    }, [rules]);

    // Handlers
    const handleEdit = (rule: PersonaRule) => {
        setEditingRule({ ...rule });
        setIsNew(false);
        setEditorOpen(true);
    };

    const handleSave = (rule: PersonaRule) => {
        if (isNew) {
            // Check duplicate
            if (rules.some((r) => r.id === rule.id)) {
                addToast(`Persona key "${rule.persona}" already exists!`, 'error');
                return;
            }
            setRules((r) => [...r, rule]);
            addToast(`Created "${rule.displayName}" successfully!`);
        } else {
            setRules((r) => r.map((existing) => (existing.id === rule.id ? rule : existing)));
            addToast(`Updated "${rule.displayName}" successfully!`);
        }
        setEditorOpen(false);
        setEditingRule(null);
    };

    const handleDelete = (rule: PersonaRule) => {
        setRules((r) => r.filter((x) => x.id !== rule.id));
        setConfirmDelete(null);
        addToast(`Deleted "${rule.displayName}"`, 'info');
    };

    const handleToggleActive = (ruleId: string) => {
        setRules((r) =>
            r.map((x) => (x.id === ruleId ? { ...x, isActive: !x.isActive, updatedAt: new Date().toISOString() } : x))
        );
    };

    const handleResetDefaults = () => {
        setRules(DEFAULT_RULES);
        addToast('Reset to default persona rules', 'info');
    };

    // Sorting
    const toggleSort = (field: 'persona' | 'updatedAt') => {
        if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    // Filtered + Sorted
    const filteredRules = rules
        .filter(
            (r) =>
                r.displayName.toLowerCase().includes(search.toLowerCase()) ||
                r.persona.toLowerCase().includes(search.toLowerCase()) ||
                r.traits.some((t) => t.toLowerCase().includes(search.toLowerCase()))
        )
        .sort((a, b) => {
            const cmp =
                sortField === 'persona'
                    ? a.persona.localeCompare(b.persona)
                    : new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
            return sortDir === 'asc' ? cmp : -cmp;
        });

    const SortIcon = ({ field }: { field: 'persona' | 'updatedAt' }) =>
        sortField === field ? (
            sortDir === 'asc' ? (
                <ChevronUp className="w-3.5 h-3.5 inline ml-1" />
            ) : (
                <ChevronDown className="w-3.5 h-3.5 inline ml-1" />
            )
        ) : null;

    return (
        <div className="space-y-6">
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                        <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Persona Rules Engine</h2>
                        <p className="text-xs text-muted-foreground">
                            Manage the mapping rules that connect quiz answers to personas and programs
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={handleResetDefaults}
                        className="p-2.5 bg-secondary/50 text-muted-foreground border border-border rounded-xl hover:text-foreground hover:border-primary/30 transition-all"
                        title="Reset to defaults"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search rules by name, key, or traits..."
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                />
            </div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden"
            >
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                            <TableHead className="pl-4 w-12">#</TableHead>
                            <TableHead
                                className="cursor-pointer select-none hover:text-primary transition-colors"
                                onClick={() => toggleSort('persona')}
                            >
                                Persona <SortIcon field="persona" />
                            </TableHead>
                            <TableHead className="hidden md:table-cell">Traits</TableHead>
                            <TableHead className="hidden lg:table-cell">Programs</TableHead>
                            <TableHead className="hidden sm:table-cell">Weights</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead
                                className="cursor-pointer select-none hover:text-primary transition-colors hidden sm:table-cell"
                                onClick={() => toggleSort('updatedAt')}
                            >
                                Updated <SortIcon field="updatedAt" />
                            </TableHead>
                            <TableHead className="text-right pr-4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                            {filteredRules.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                            <Search className="w-8 h-8 opacity-40" />
                                            <p className="font-medium">No rules found</p>
                                            <p className="text-xs">Try a different search term or create a new rule.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRules.map((rule, idx) => (
                                    <React.Fragment key={rule.id}>
                                        <motion.tr
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className={`border-b border-border transition-colors hover:bg-secondary/30 cursor-pointer ${expandedRow === rule.id ? 'bg-secondary/20' : ''
                                                }`}
                                            onClick={() => setExpandedRow(expandedRow === rule.id ? null : rule.id)}
                                        >
                                            <TableCell className="pl-4 font-mono text-sm text-muted-foreground">
                                                {idx + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${rule.gradientClass} flex items-center justify-center text-lg shadow-md`}
                                                    >
                                                        {rule.icon}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-foreground text-sm">{rule.displayName}</p>
                                                        <p className="text-xs text-muted-foreground font-mono">{rule.persona}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                    {rule.traits.slice(0, 2).map((t, i) => (
                                                        <Badge
                                                            key={i}
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {t}
                                                        </Badge>
                                                    ))}
                                                    {rule.traits.length > 2 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{rule.traits.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <div className="flex items-center gap-1">
                                                    {rule.programIds.slice(0, 2).map((pid) => {
                                                        const prog = PROGRAM_DATA[pid];
                                                        return prog ? (
                                                            <span key={pid} className="text-lg" title={prog.name}>
                                                                {prog.icon}
                                                            </span>
                                                        ) : null;
                                                    })}
                                                    {rule.programIds.length > 2 && (
                                                        <span className="text-xs text-muted-foreground font-medium ml-1">
                                                            +{rule.programIds.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[10px] text-muted-foreground w-5">L</span>
                                                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-blue-500 rounded-full"
                                                                style={{ width: `${rule.logicWeight * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[10px] text-muted-foreground w-5">C</span>
                                                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-purple-500 rounded-full"
                                                                style={{ width: `${rule.creativeWeight * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleActive(rule.id);
                                                    }}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${rule.isActive
                                                        ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'
                                                        : 'bg-muted text-muted-foreground border border-border'
                                                        }`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${rule.isActive ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                                                    {rule.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                                                {new Date(rule.updatedAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: undefined,
                                                })}
                                            </TableCell>
                                            <TableCell className="text-right pr-4">
                                                <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => handleEdit(rule)}
                                                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDelete(rule)}
                                                        className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </motion.tr>

                                        {/* Expanded Detail Row */}
                                        <AnimatePresence>
                                            {expandedRow === rule.id && (
                                                <motion.tr
                                                    key={`${rule.id}-detail`}
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="bg-secondary/10"
                                                >
                                                    <TableCell colSpan={8} className="px-6 py-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                                                    Description
                                                                </p>
                                                                <p className="text-sm text-foreground leading-relaxed">
                                                                    {rule.description}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                                                    All Traits
                                                                </p>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {rule.traits.map((t, i) => (
                                                                        <Badge key={i} variant="secondary" className="text-xs">
                                                                            {t}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                                                    Mapped Programs
                                                                </p>
                                                                <div className="space-y-1.5">
                                                                    {rule.programIds.map((pid) => {
                                                                        const prog = PROGRAM_DATA[pid];
                                                                        return prog ? (
                                                                            <div key={pid} className="flex items-center gap-2">
                                                                                <span>{prog.icon}</span>
                                                                                <span className="text-sm text-foreground">{prog.name}</span>
                                                                            </div>
                                                                        ) : (
                                                                            <span key={pid} className="text-xs text-muted-foreground">
                                                                                {pid}
                                                                            </span>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </motion.tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                ))
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>

                {/* Footer */}
                <div className="border-t border-border bg-secondary/20 px-4 py-3 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        Showing {filteredRules.length} of {rules.length} rule{rules.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                            {rules.filter((r) => r.isActive).length} active
                        </span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                            {rules.filter((r) => !r.isActive).length} inactive
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Editor Dialog */}
            <RuleEditorDialog
                open={editorOpen}
                rule={editingRule}
                isNew={isNew}
                onSave={handleSave}
                onClose={() => {
                    setEditorOpen(false);
                    setEditingRule(null);
                }}
            />

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={!!confirmDelete}
                title="Delete Persona Rule"
                description={`Are you sure you want to delete "${confirmDelete?.displayName}"? This action cannot be undone and will remove the rule from all future recommendations.`}
                onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
                onCancel={() => setConfirmDelete(null)}
            />

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[100] space-y-2">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <ToastNotification key={t.id} toast={t} onDismiss={() => dismissToast(t.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
