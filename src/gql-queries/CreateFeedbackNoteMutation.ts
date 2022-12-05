import { gql } from "@apollo/client";

export const CREATE_FEEDBACK_NOTE_MUTATION = gql`
  mutation CreateFeedbackNote(
    $note: String
    $attachmentIds: [SmartID!]
    $noteType: SmartID!
    $taskShotId: SmartID!
    $version: ID!
  ) {
    createFeedbackNote(
      note: $note
      attachmentIds: $attachmentIds
      noteType: $noteType
      version: $version
      taskShotId: $taskShotId
    ) {
      success
      message
    }
  }
`;
