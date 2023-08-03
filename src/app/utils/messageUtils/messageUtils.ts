import React, { Dispatch, SetStateAction } from "react";
import styles from "./messageUtils.module.scss";

export enum MessageType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
}

export function showMessage(
  message: string,
  type: MessageType,
  setStatusMessage: Dispatch<SetStateAction<string>>,
  setMessageType: Dispatch<SetStateAction<MessageType | null>>
) {
  setStatusMessage(message);
  setMessageType(type);
}

export function hideMessage(
  setStatusMessage: Dispatch<SetStateAction<string>>,
  setMessageType: Dispatch<SetStateAction<MessageType | null>>
) {
  setStatusMessage("");
  setMessageType(null);
}

export function getMessageStyles(type: MessageType | null): string {
  switch (type) {
    case MessageType.SUCCESS:
      return `${styles.card} ${styles.success}`;
    case MessageType.ERROR:
      return `${styles.card} ${styles.error}`;
    case MessageType.WARNING:
      return `${styles.card} ${styles.warning}`;
    default:
      return styles.card;
  }
}

interface MessageProps {
  message: string;
  type: MessageType;
  setStatusMessage: Dispatch<SetStateAction<string>>;
  setMessageType: Dispatch<SetStateAction<MessageType | null>>;
}
