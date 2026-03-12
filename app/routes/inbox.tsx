import React from "react";
import { Plus, Link as LinkIcon, MessageSquare, FileText, Image, Check, X, Inbox as InboxIcon } from "lucide-react";
import classNames from "classnames";
import type { Route } from "./+types/inbox";
import { mockInboxItems, type InboxItem } from "~/data/inbox";
import styles from "./inbox.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Campaign Inbox - AirdropPulse" },
    {
      name: "description",
      content: "Review and refine AI-extracted airdrop opportunities",
    },
  ];
}

export default function Inbox() {
  const [filter, setFilter] = React.useState<"all" | "processing" | "review">("all");
  const [selectedItem, setSelectedItem] = React.useState<InboxItem | null>(mockInboxItems[0] || null);

  const filteredItems = mockInboxItems.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case "telegram":
        return MessageSquare;
      case "link":
        return LinkIcon;
      case "text":
        return FileText;
      case "image":
        return Image;
      default:
        return FileText;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <main className={styles.inbox}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Campaign Inbox</h1>
          <p className={styles.subtitle}>Review and refine AI-extracted airdrop opportunities before activation</p>
        </header>

        <div className={styles.controls}>
          <button className={styles.addButton}>
            <Plus style={{ width: "20px", height: "20px" }} />
            Add New Content
          </button>

          <div className={styles.filterTabs}>
            <button
              className={classNames(styles.filterTab, { [styles.filterTabActive]: filter === "all" })}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={classNames(styles.filterTab, { [styles.filterTabActive]: filter === "processing" })}
              onClick={() => setFilter("processing")}
            >
              Processing
            </button>
            <button
              className={classNames(styles.filterTab, { [styles.filterTabActive]: filter === "review" })}
              onClick={() => setFilter("review")}
            >
              Review
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.queueSection}>
            <h2 className={styles.sectionTitle}>
              Processing Queue
              <span className={styles.badge}>{filteredItems.length}</span>
            </h2>

            <div className={styles.itemsList}>
              {filteredItems.map((item) => {
                const SourceIcon = getSourceIcon(item.sourceType);
                return (
                  <div
                    key={item.id}
                    className={classNames(styles.item, {
                      [styles.itemActive]: selectedItem?.id === item.id,
                    })}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className={styles.itemHeader}>
                      <span className={styles.itemSource}>
                        <SourceIcon className={styles.itemIcon} />
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
                    <p className={styles.itemContent}>{item.rawContent}</p>
                    <div className={styles.itemTime}>{formatTime(item.createdAt)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.reviewPanel}>
            {selectedItem ? (
              <>
                <div className={styles.reviewHeader}>
                  <h2 className={styles.reviewTitle}>Review Workspace</h2>
                </div>

                <div className={styles.originalContent}>
                  <div className={styles.originalLabel}>Original Content</div>
                  <p className={styles.originalText}>{selectedItem.rawContent}</p>
                </div>

                {selectedItem.extractedData && (
                  <div className={styles.extractedSection}>
                    <h3 className={styles.extractedTitle}>AI-Extracted Data</h3>

                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>Project Name</div>
                      <div className={styles.fieldValue}>
                        {selectedItem.extractedData.projectName || "Not detected"}
                      </div>
                    </div>

                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>Category</div>
                      <div className={styles.fieldValue}>{selectedItem.extractedData.category || "Not detected"}</div>
                    </div>

                    {selectedItem.extractedData.chain && selectedItem.extractedData.chain.length > 0 && (
                      <div className={styles.field}>
                        <div className={styles.fieldLabel}>Chains</div>
                        <div className={styles.tagsList}>
                          {selectedItem.extractedData.chain.map((chain) => (
                            <span key={chain} className={styles.tag}>
                              {chain}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedItem.extractedData.fundingAmount && (
                      <div className={styles.field}>
                        <div className={styles.fieldLabel}>Funding</div>
                        <div className={styles.fieldValue}>{selectedItem.extractedData.fundingAmount}</div>
                      </div>
                    )}

                    {selectedItem.extractedData.investors && selectedItem.extractedData.investors.length > 0 && (
                      <div className={styles.field}>
                        <div className={styles.fieldLabel}>Investors</div>
                        <div className={styles.tagsList}>
                          {selectedItem.extractedData.investors.map((investor) => (
                            <span key={investor} className={styles.tag}>
                              {investor}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedItem.extractedData.steps && selectedItem.extractedData.steps.length > 0 && (
                      <div className={styles.field}>
                        <div className={styles.fieldLabel}>Extracted Steps</div>
                        <div className={styles.stepsList}>
                          {selectedItem.extractedData.steps.map((step, index) => (
                            <div key={index} className={styles.step}>
                              <span className={styles.stepNumber}>{index + 1}</span>
                              <span className={styles.stepText}>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedItem.extractedData.potentialValue && (
                      <div className={styles.field}>
                        <div className={styles.fieldLabel}>Potential Value</div>
                        <div className={styles.fieldValue}>{selectedItem.extractedData.potentialValue}</div>
                      </div>
                    )}
                  </div>
                )}

                <div className={styles.actions}>
                  <button className={classNames(styles.actionButton, styles.approveButton)}>
                    <Check style={{ width: "20px", height: "20px" }} />
                    Approve & Activate
                  </button>
                  <button className={classNames(styles.actionButton, styles.rejectButton)}>
                    <X style={{ width: "20px", height: "20px" }} />
                    Reject
                  </button>
                </div>
              </>
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
