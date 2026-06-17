import React from "react";
import {
  Plus,
  Link as LinkIcon,
  MessageSquare,
  FileText,
  Image,
  Check,
  X,
  Inbox as InboxIcon,
  Zap,
  Newspaper,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Clock,
  Tag,
  AlertTriangle,
  BookOpen,
  RotateCcw,
  Eye,
  Edit3,
} from "lucide-react";
import classNames from "classnames";
import { toast } from "sonner";
import type { Route } from "./+types/inbox";
import type { InboxItem, InboxItemType, ExtractedData, NewsTag } from "~/data/inbox";
import { useStore } from "~/hooks/use-store";
import styles from "./inbox.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Intelligence Inbox - AirdropPulse" },
    {
      name: "description",
      content: "Review and approve AI-extracted airdrop tasks and project news",
    },
  ];
}

type FilterType = "all" | "flash-task" | "task" | "news" | "processing";

const NEWS_TAG_COLORS: Record<NewsTag, string> = {
  "Vesting": "tagVesting",
  "Mainnet": "tagMainnet",
  "Partnership": "tagPartnership",
  "Scam Alert": "tagScam",
  "TGE": "tagTge",
  "Snapshot": "tagSnapshot",
  "Funding": "tagFunding",
  "Airdrop": "tagAirdrop",
  "New Project": "tagNewProject",
  "Update": "tagUpdate",
};

const ALL_NEWS_TAGS: NewsTag[] = [
  "Vesting", "Mainnet", "Partnership", "Scam Alert", "TGE",
  "Snapshot", "Funding", "Airdrop", "New Project", "Update",
];

export default function InboxPage() {
  const { inboxItems, updateInboxItem, deleteInboxItem, addInboxItem, addTask, projects } = useStore();
  const [filter, setFilter] = React.useState<FilterType>("all");
  const [selectedId, setSelectedId] = React.useState<string | null>(inboxItems[0]?.id ?? null);
  const [editData, setEditData] = React.useState<ExtractedData | null>(null);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newRaw, setNewRaw] = React.useState("");
  const [newType, setNewType] = React.useState<InboxItemType>("task");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const pendingCount = inboxItems.filter((i) => i.status === "review" || i.status === "processing").length;
  const flashCount = inboxItems.filter((i) => i.itemType === "flash-task" && i.status === "review").length;

  const filteredItems = inboxItems.filter((item) => {
    if (filter === "processing") return item.status === "processing";
    if (filter === "all") return item.status === "review" || item.status === "processing";
    return item.itemType === filter && (item.status === "review" || item.status === "processing");
  });

  const selectedItem = inboxItems.find((i) => i.id === selectedId) ?? null;

  // Sync editData when selected item changes
  React.useEffect(() => {
    if (selectedItem?.extractedData) {
      setEditData({ ...selectedItem.extractedData });
    } else {
      setEditData(null);
    }
  }, [selectedId]);

  function getSourceIcon(sourceType: string) {
    switch (sourceType) {
      case "telegram": return MessageSquare;
      case "link": return LinkIcon;
      case "text": return FileText;
      case "image": return Image;
      default: return FileText;
    }
  }

  function getItemTypeIcon(itemType: InboxItemType) {
    switch (itemType) {
      case "flash-task": return Zap;
      case "task": return CheckSquare;
      case "news": return Newspaper;
      default: return FileText;
    }
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  }

  function handleApprove() {
    if (!selectedItem) return;
    setIsSubmitting(true);

    // Merge edited extractedData back
    const finalItem: InboxItem = {
      ...selectedItem,
      extractedData: editData ?? selectedItem.extractedData,
      status: "approved",
    };
    updateInboxItem(finalItem);

    // Commit data to store
    if (selectedItem.itemType === "task" || selectedItem.itemType === "flash-task") {
      const data = editData ?? selectedItem.extractedData;
      if (data) {
        const projectMatch = projects.find(
          (p) => p.name.toLowerCase() === (data.projectName ?? "").toLowerCase(),
        );
        addTask({
          id: `task-inbox-${Date.now()}`,
          title: data.taskTitle || data.projectName || "Untitled Task",
          description: data.steps?.join("\n") ?? "",
          guide: data.guideContent?.trim() || undefined,
          guideSource: data.guideContent?.trim() ? "ai-extracted" : undefined,
          guideSourceLabel: selectedItem.sourceType === "telegram" ? "Telegram" : selectedItem.sourceType === "link" ? selectedItem.sourceUrl ?? "Link" : "Inbox",
          type: data.taskType ?? "onchain",
          priority: data.taskPriority ?? "medium",
          status: "backlog",
          recurring: data.taskClassification === "recurring" ? "daily" : null,
          projectId: projectMatch?.id,
          projectName: data.projectName,
          estimatedGasFee: data.gasFee,
          deadline: data.deadline,
          createdAt: new Date().toISOString().slice(0, 10),
          executions: [],
          tags: data.chain ?? [],
          guideUrl: data.guideUrl,
          subtasks: (data.subtasks ?? []).map((s, i) => ({
            id: `st-inbox-${Date.now()}-${i}`,
            title: s,
            completed: false,
          })),
          notes: [],
          activityLog: [
            {
              id: `al-inbox-${Date.now()}`,
              type: "note-added",
              message: "Task created from Inbox (AI-extracted)",
              timestamp: new Date().toISOString().slice(0, 10),
            },
          ],
        });
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Approved & committed to system.");
      // Select next item
      const remaining = filteredItems.filter((i) => i.id !== selectedItem.id);
      setSelectedId(remaining[0]?.id ?? null);
    }, 600);
  }

  function handleDiscard() {
    if (!selectedItem) return;
    deleteInboxItem(selectedItem.id);
    toast.info("Item discarded.");
    const remaining = filteredItems.filter((i) => i.id !== selectedItem.id);
    setSelectedId(remaining[0]?.id ?? null);
  }

  function handleAddManual() {
    if (!newRaw.trim()) return;
    const item: InboxItem = {
      id: `i-${Date.now()}`,
      rawContent: newRaw.trim(),
      sourceType: "text",
      itemType: newType,
      status: "processing",
      createdAt: new Date().toISOString(),
    };
    addInboxItem(item);
    setNewRaw("");
    setShowAddForm(false);
    toast.success("Added to inbox for processing.");
    setSelectedId(item.id);
    // Simulate AI processing after 1.5s
    setTimeout(() => {
      updateInboxItem({ ...item, status: "review" });
    }, 1500);
  }

  return (
    <main className={styles.inbox}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Intelligence Inbox</h1>
            <p className={styles.subtitle}>Review AI-extracted tasks & project news before committing to your workflow</p>
          </div>
          <div className={styles.headerStats}>
            {flashCount > 0 && (
              <div className={styles.flashAlert}>
                <Zap size={14} />
                {flashCount} Flash Task{flashCount > 1 ? "s" : ""} Expiring
              </div>
            )}
            <div className={styles.pendingBadgeBlock}>
              <span className={styles.pendingNum}>{pendingCount}</span>
              <span className={styles.pendingLabel}>Pending Review</span>
            </div>
          </div>
        </header>

        <div className={styles.controls}>
          <button className={styles.addButton} onClick={() => setShowAddForm((v) => !v)}>
            <Plus style={{ width: "16px", height: "16px" }} />
            Add Content
          </button>

          <div className={styles.filterTabs}>
            {(["all", "flash-task", "task", "news", "processing"] as FilterType[]).map((f) => (
              <button
                key={f}
                className={classNames(styles.filterTab, { [styles.filterTabActive]: filter === f })}
                onClick={() => setFilter(f)}
              >
                {f === "flash-task" && <Zap size={12} />}
                {f === "task" && <CheckSquare size={12} />}
                {f === "news" && <Newspaper size={12} />}
                {f === "all" ? "All Pending" : f === "flash-task" ? "Flash" : f === "task" ? "Tasks" : f === "news" ? "News" : "Processing"}
              </button>
            ))}
          </div>
        </div>

        {/* Manual add form */}
        {showAddForm && (
          <div className={styles.addForm}>
            <textarea
              className={styles.addTextarea}
              value={newRaw}
              onChange={(e) => setNewRaw(e.target.value)}
              placeholder="Paste Telegram message, tweet, or any content here..."
              rows={4}
            />
            <div className={styles.addFormRow}>
              <select
                className={styles.addSelect}
                value={newType}
                onChange={(e) => setNewType(e.target.value as InboxItemType)}
              >
                <option value="task">Task</option>
                <option value="flash-task">Flash Task</option>
                <option value="news">News</option>
              </select>
              <button className={styles.addSubmitBtn} onClick={handleAddManual}>
                Submit for AI Processing
              </button>
              <button className={styles.addCancelBtn} onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className={styles.grid}>
          {/* Queue */}
          <div className={styles.queueSection}>
            <h2 className={styles.sectionTitle}>
              Queue
              <span className={styles.badge}>{filteredItems.length}</span>
            </h2>

            <div className={styles.itemsList}>
              {filteredItems.length === 0 && (
                <div className={styles.emptyQueue}>
                  <InboxIcon size={32} />
                  <p>No items matching this filter</p>
                </div>
              )}
              {filteredItems.map((item) => {
                const SourceIcon = getSourceIcon(item.sourceType);
                const TypeIcon = getItemTypeIcon(item.itemType);
                return (
                  <div
                    key={item.id}
                    className={classNames(styles.item, {
                      [styles.itemActive]: selectedId === item.id,
                      [styles.itemFlash]: item.itemType === "flash-task",
                      [styles.itemNews]: item.itemType === "news",
                    })}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <div className={styles.itemHeader}>
                      <span className={classNames(styles.itemTypePill, {
                        [styles.pillFlash]: item.itemType === "flash-task",
                        [styles.pillTask]: item.itemType === "task",
                        [styles.pillNews]: item.itemType === "news",
                      })}>
                        <TypeIcon size={11} />
                        {item.itemType === "flash-task" ? "Flash" : item.itemType === "task" ? "Task" : "News"}
                      </span>
                      <span className={styles.itemSource}>
                        <SourceIcon size={12} />
                        {item.sourceType}
                      </span>
                      <span
                        className={classNames(styles.statusBadge, {
                          [styles.statusProcessing]: item.status === "processing",
                          [styles.statusReview]: item.status === "review",
                        })}
                      >
                        {item.status}
                      </span>
                    </div>

                    {item.extractedData?.taskTitle || item.extractedData?.newsTitle ? (
                      <p className={styles.itemTitle}>
                        {item.extractedData.taskTitle ?? item.extractedData.newsTitle}
                      </p>
                    ) : null}
                    <p className={styles.itemContent}>{item.rawContent}</p>

                    <div className={styles.itemFooter}>
                      {item.extractedData?.projectName && (
                        <span className={styles.itemProject}>{item.extractedData.projectName}</span>
                      )}
                      <div className={styles.itemTime}>{formatTime(item.createdAt)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review panel */}
          <div className={styles.reviewPanel}>
            {selectedItem ? (
              <ReviewWorkspace
                item={selectedItem}
                editData={editData}
                setEditData={setEditData}
                onApprove={handleApprove}
                onDiscard={handleDiscard}
                isSubmitting={isSubmitting}
              />
            ) : (
              <div className={styles.emptyState}>
                <InboxIcon className={styles.emptyIcon} />
                <h3 className={styles.emptyTitle}>No Item Selected</h3>
                <p>Select an item from the queue to review</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// ---- Review Workspace ----

interface ReviewWorkspaceProps {
  item: InboxItem;
  editData: ExtractedData | null;
  setEditData: React.Dispatch<React.SetStateAction<ExtractedData | null>>;
  onApprove: () => void;
  onDiscard: () => void;
  isSubmitting: boolean;
}

// ---- Guide Editor ----

interface GuideEditorProps {
  rawContent: string;
  guideContent: string;
  onChange: (val: string) => void;
  aiSteps?: string[];
}

function GuideEditor({ rawContent, guideContent, onChange, aiSteps }: GuideEditorProps) {
  const [previewMode, setPreviewMode] = React.useState(false);

  /** Build default guide text from AI steps when user clicks Sync */
  function buildFromSteps(): string {
    if (!aiSteps || aiSteps.length === 0) return rawContent;
    const lines = aiSteps.map((s, i) => `${i + 1}. ${s}`).join("\n");
    return `## Steps\n\n${lines}`;
  }

  function handleSync() {
    onChange(buildFromSteps());
  }

  return (
    <div className={styles.guideEditor}>
      <div className={styles.guideEditorHeader}>
        <label className={styles.fieldLabel}>
          <BookOpen size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
          GUIDE Content
          <span className={styles.guideBadge}>AI-Editable</span>
        </label>
        <div className={styles.guideEditorActions}>
          <button
            type="button"
            className={classNames(styles.guideModeBtn, { [styles.guideModeBtnActive]: !previewMode })}
            onClick={() => setPreviewMode(false)}
          >
            <Edit3 size={11} /> Edit
          </button>
          <button
            type="button"
            className={classNames(styles.guideModeBtn, { [styles.guideModeBtnActive]: previewMode })}
            onClick={() => setPreviewMode(true)}
          >
            <Eye size={11} /> Preview
          </button>
          <button
            type="button"
            className={styles.guideSyncBtn}
            onClick={handleSync}
            title="Sync from AI-extracted steps"
          >
            <RotateCcw size={11} /> Sync from Source
          </button>
        </div>
      </div>

      {previewMode ? (
        <div className={styles.guidePreview}>
          {guideContent ? (
            guideContent.split("\n").map((line, i) => {
              const t = line.trim();
              if (t.startsWith("## ")) return <h3 key={i} className={styles.guidePreviewH2}>{t.slice(3)}</h3>;
              if (t.startsWith("### ")) return <h4 key={i} className={styles.guidePreviewH3}>{t.slice(4)}</h4>;
              if (t.startsWith("> ")) return <p key={i} className={styles.guidePreviewBlockquote}>{t.slice(2)}</p>;
              if (/^\d+\.\s/.test(t)) return <p key={i} className={styles.guidePreviewLi}>{t}</p>;
              if (t.startsWith("- ")) return <p key={i} className={styles.guidePreviewLi}>{t}</p>;
              if (t === "") return <div key={i} style={{ height: 8 }} />;
              return <p key={i} className={styles.guidePreviewP}
                dangerouslySetInnerHTML={{ __html: t
                  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\*(.+?)\*/g, "<em>$1</em>")
                  .replace(/\[(.+?)\]\((.+?)\)/g, "<a href=\"$2\" target=\"_blank\" rel=\"noopener noreferrer\">$1</a>")
                }}
              />;
            })
          ) : (
            <p className={styles.guidePreviewEmpty}>No guide content yet. Switch to Edit and start writing, or click &ldquo;Sync from Source&rdquo;.</p>
          )}
        </div>
      ) : (
        <textarea
          className={styles.guideTextarea}
          value={guideContent}
          onChange={(e) => onChange(e.target.value)}
          placeholder={"Write step-by-step guide here. Markdown supported:\n\n## Title\n\n1. First step\n2. Second step\n\n**Bold**, *italic*, > tip"}
          rows={8}
        />
      )}
    </div>
  );
}

function ReviewWorkspace({ item, editData, setEditData, onApprove, onDiscard, isSubmitting }: ReviewWorkspaceProps) {
  const [showOriginal, setShowOriginal] = React.useState(true);

  function updateField<K extends keyof ExtractedData>(key: K, value: ExtractedData[K]) {
    setEditData((prev) => ({ ...(prev ?? {}), [key]: value }));
  }

  function addSubtask() {
    const current = editData?.subtasks ?? [];
    updateField("subtasks", [...current, ""]);
  }

  function updateSubtask(i: number, val: string) {
    const updated = [...(editData?.subtasks ?? [])];
    updated[i] = val;
    updateField("subtasks", updated);
  }

  function removeSubtask(i: number) {
    const updated = (editData?.subtasks ?? []).filter((_, idx) => idx !== i);
    updateField("subtasks", updated);
  }

  function toggleNewsTag(tag: NewsTag) {
    const current = editData?.newsTags ?? [];
    const next = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    updateField("newsTags", next);
  }

  const isTask = item.itemType === "task" || item.itemType === "flash-task";
  const isNews = item.itemType === "news";
  const hasExtracted = !!item.extractedData && item.status !== "processing";

  return (
    <div className={styles.workspace}>
      <div className={styles.workspaceHeader}>
        <h2 className={styles.reviewTitle}>Review Workspace</h2>
        <div className={classNames(styles.workspaceTypeBadge, {
          [styles.pillFlash]: item.itemType === "flash-task",
          [styles.pillTask]: item.itemType === "task",
          [styles.pillNews]: item.itemType === "news",
        })}>
          {item.itemType === "flash-task" ? "⚡ Flash Task" : item.itemType === "task" ? "✓ Task" : "📰 News"}
        </div>
      </div>

      <div className={styles.workspaceBody}>

      {/* Flash expiry warning */}
      {item.itemType === "flash-task" && item.extractedData?.flashExpiresAt && (
        <div className={styles.flashWarning}>
          <Zap size={14} />
          <strong>Flash Task — Expires:</strong> {new Date(item.extractedData.flashExpiresAt).toLocaleString()}
        </div>
      )}

      {/* Original content toggle */}
      <div className={styles.originalSection}>
        <button
          className={styles.originalToggle}
          onClick={() => setShowOriginal((v) => !v)}
        >
          <span className={styles.originalLabel}>Original Content</span>
          {showOriginal ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showOriginal && (
          <div className={styles.originalBox}>
            <p className={styles.originalText}>{item.rawContent}</p>
            {item.sourceUrl && (
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                <LinkIcon size={12} /> {item.sourceUrl}
              </a>
            )}
          </div>
        )}
      </div>

      {item.status === "processing" && (
        <div className={styles.processingState}>
          <div className={styles.processingSpinner} />
          <p>AI is analyzing content...</p>
        </div>
      )}

      {hasExtracted && editData && (
        <div className={styles.extractedSection}>
          <h3 className={styles.extractedTitle}>
            AI-Extracted Data
            <span className={styles.editHint}>— all fields are editable</span>
          </h3>

          {/* Common fields */}
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Project Name</label>
              <input
                className={styles.fieldInput}
                value={editData.projectName ?? ""}
                onChange={(e) => updateField("projectName", e.target.value)}
              />
            </div>
            {editData.chain && (
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Chains</label>
                <div className={styles.tagsList}>
                  {editData.chain.map((c) => (
                    <span key={c} className={styles.tag}>{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Task-specific fields */}
          {isTask && (
            <>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Task Title</label>
                  <input
                    className={styles.fieldInput}
                    value={editData.taskTitle ?? ""}
                    onChange={(e) => updateField("taskTitle", e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Classification</label>
                  <select
                    className={styles.fieldSelect}
                    value={editData.taskClassification ?? "one-time"}
                    onChange={(e) => updateField("taskClassification", e.target.value as "recurring" | "one-time" | "instant")}
                  >
                    <option value="one-time">One-time</option>
                    <option value="recurring">Recurring</option>
                    <option value="instant">Instant / Flash</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Priority</label>
                  <select
                    className={styles.fieldSelect}
                    value={editData.taskPriority ?? "medium"}
                    onChange={(e) => updateField("taskPriority", e.target.value as "high" | "medium" | "low")}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Task Type</label>
                  <select
                    className={styles.fieldSelect}
                    value={editData.taskType ?? "onchain"}
                    onChange={(e) => updateField("taskType", e.target.value as "onchain" | "social" | "daily-checkin" | "one-time")}
                  >
                    <option value="onchain">On-chain</option>
                    <option value="social">Social</option>
                    <option value="daily-checkin">Daily Check-in</option>
                    <option value="one-time">One-time</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Deadline</label>
                  <input
                    type="date"
                    className={styles.fieldInput}
                    value={editData.deadline ?? ""}
                    onChange={(e) => updateField("deadline", e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Gas Fee (est.)</label>
                  <input
                    className={styles.fieldInput}
                    value={editData.gasFee ?? ""}
                    onChange={(e) => updateField("gasFee", e.target.value)}
                    placeholder="e.g. ~$5"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Guide URL</label>
                  <input
                    className={styles.fieldInput}
                    value={editData.guideUrl ?? ""}
                    onChange={(e) => updateField("guideUrl", e.target.value)}
                    placeholder="https://"
                  />
                </div>
              </div>

              {/* Subtasks editor */}
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Subtasks</label>
                <div className={styles.subtaskList}>
                  {(editData.subtasks ?? []).map((s, i) => (
                    <div key={i} className={styles.subtaskRow}>
                      <span className={styles.subtaskNum}>{i + 1}</span>
                      <input
                        className={styles.subtaskInput}
                        value={s}
                        onChange={(e) => updateSubtask(i, e.target.value)}
                        placeholder="Subtask description"
                      />
                      <button className={styles.subtaskRemove} onClick={() => removeSubtask(i)} type="button">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button className={styles.subtaskAdd} onClick={addSubtask} type="button">
                    <Plus size={12} /> Add Subtask
                  </button>
                </div>
              </div>

              {/* Guide Content Editor */}
              <GuideEditor
                rawContent={item.rawContent}
                guideContent={editData.guideContent ?? ""}
                onChange={(val) => updateField("guideContent", val)}
                aiSteps={editData.steps}
              />

              {editData.steps && editData.steps.length > 0 && (
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Extracted Steps</label>
                  <div className={styles.stepsList}>
                    {editData.steps.map((step, i) => (
                      <div key={i} className={styles.step}>
                        <span className={styles.stepNumber}>{i + 1}</span>
                        <span className={styles.stepText}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* News-specific fields */}
          {isNews && (
            <>
              <div className={styles.fieldGrid}>
                <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
                  <label className={styles.fieldLabel}>News Title</label>
                  <input
                    className={styles.fieldInput}
                    value={editData.newsTitle ?? ""}
                    onChange={(e) => updateField("newsTitle", e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>News Type</label>
                  <select
                    className={styles.fieldSelect}
                    value={editData.newsType ?? "news"}
                    onChange={(e) => updateField("newsType", e.target.value as "news" | "milestone" | "status-change" | "announcement")}
                  >
                    <option value="news">News</option>
                    <option value="announcement">Announcement</option>
                    <option value="milestone">Milestone</option>
                    <option value="status-change">Status Change</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Source</label>
                  <input
                    className={styles.fieldInput}
                    value={editData.newsSource ?? ""}
                    onChange={(e) => updateField("newsSource", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  <Tag size={12} /> News Tags
                </label>
                <div className={styles.newsTagGrid}>
                  {ALL_NEWS_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={classNames(
                        styles.newsTagBtn,
                        styles[NEWS_TAG_COLORS[tag]],
                        { [styles.newsTagBtnActive]: (editData.newsTags ?? []).includes(tag) },
                      )}
                      onClick={() => toggleNewsTag(tag)}
                    >
                      {tag === "Scam Alert" && <AlertTriangle size={10} />}
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Funding / investors (both) */}
          {(editData.fundingAmount || (editData.investors && editData.investors.length > 0)) && (
            <div className={styles.fieldGrid}>
              {editData.fundingAmount && (
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Funding</label>
                  <input
                    className={styles.fieldInput}
                    value={editData.fundingAmount}
                    onChange={(e) => updateField("fundingAmount", e.target.value)}
                  />
                </div>
              )}
              {editData.investors && editData.investors.length > 0 && (
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Investors</label>
                  <div className={styles.tagsList}>
                    {editData.investors.map((inv) => (
                      <span key={inv} className={styles.tag}>{inv}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      </div>{/* end workspaceBody */}

      {/* Sticky Actions footer */}
      {item.status !== "processing" && (
        <div className={styles.actions}>
          <button
            className={classNames(styles.actionButton, styles.rejectButton)}
            onClick={onDiscard}
            disabled={isSubmitting}
          >
            <X size={15} />
            Discard
          </button>
          <button
            className={classNames(styles.actionButton, styles.approveButton)}
            onClick={onApprove}
            disabled={isSubmitting}
          >
            {isSubmitting ? <span className={styles.loadingDot} /> : <Check size={15} />}
            {isSubmitting ? "Committing…" : "Approve & Commit"}
          </button>
        </div>
      )}
    </div>
  );
}
