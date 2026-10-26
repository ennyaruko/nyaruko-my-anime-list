import { useTranslation } from "react-i18next";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import type { MediaListStatus } from "@/entities/media";
import { mediaListActionsServiceToken } from "@/entities/media";

import { showNotification } from "@/shared/ui";
import { useAppService, queryCacheConfig } from "@/shared/lib";

type MediaListAction =
  | { type: "remove"; listEntryId: number }
  | { mediaId: number; type: "progress"; progress: number }
  | { type: "status"; mediaId: number; status: MediaListStatus };

type StatusTranslationKey =
  | "common:ui.watchStatus.paused"
  | "common:ui.watchStatus.dropped"
  | "common:ui.watchStatus.planned"
  | "common:ui.watchStatus.watching"
  | "common:ui.watchStatus.completed";

const statusTranslationKey: Record<MediaListStatus, StatusTranslationKey> = {
  PAUSED: "common:ui.watchStatus.paused",
  DROPPED: "common:ui.watchStatus.dropped",
  CURRENT: "common:ui.watchStatus.watching",
  PLANNING: "common:ui.watchStatus.planned",
  COMPLETED: "common:ui.watchStatus.completed",
};

/** Mutations and cache refreshes for the current user's media-list entries. */
export function useMediaListActions(userId: string | undefined) {
  const { t } = useTranslation(["common"]);
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const service = useAppService(mediaListActionsServiceToken);
  const canManageList = Boolean(accessToken && userId);

  const mutation = useMutation({
    meta: { errorNotifier: () => null },
    onError: () => {
      showNotification(t("common:notify.mediaListActionFailed"), "error");
    },
    mutationFn: (action: MediaListAction) => {
      if (!accessToken) {
        throw new Error("An authenticated AniList session is required.");
      }

      switch (action.type) {
        case "status":
          return service.setStatus(accessToken, action.mediaId, action.status);
        case "remove":
          return service.removeEntry(accessToken, action.listEntryId);
        case "progress":
          return service.updateProgress(
            accessToken,
            action.mediaId,
            action.progress,
          );
      }
    },
    onSuccess: async (_, action) => {
      if (userId) {
        await queryClient.invalidateQueries({
          exact: true,
          queryKey: queryCacheConfig.families.userList.key(userId),
        });
      }

      if (action.type === "status") {
        showNotification(
          t("common:notify.mediaStatusChanged", {
            status: t(statusTranslationKey[action.status]),
          }),
          "success",
        );
      }

      if (action.type === "remove") {
        showNotification(t("common:notify.mediaRemovedFromList"), "success");
      }
    },
  });

  const changeStatus = (mediaId: number, status: MediaListStatus) => {
    if (canManageList) {
      mutation.mutate({ status, mediaId, type: "status" });
    }
  };

  const removeFromList = (listEntryId: number) => {
    if (canManageList) {
      mutation.mutate({ listEntryId, type: "remove" });
    }
  };

  const updateProgress = (mediaId: number, progress: number) => {
    if (canManageList) {
      mutation.mutate({ mediaId, progress, type: "progress" });
    }
  };

  return {
    changeStatus,
    canManageList,
    removeFromList,
    updateProgress,
    isPending: mutation.isPending,
  };
}
