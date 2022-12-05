import { gql } from "@apollo/client";

export default gql`
  query Previews($taskShotIds: String) {
    previews(taskShotIds: $taskShotIds) {
      id
      versionNumber
      deliveryType
      errorMessage
      deliveryDetails {
        video
      }
      projectDetails {
        id
        name
        created
        creator
      }
      vendorDetails {
        companyName
        website
      }
      serviceDetails {
        id
        name
      }
      shotDetails {
        id
        name
        artist
        sourceURL
      }
      shotNotes {
        id
        noteType
        note
        createdBy
        createdAt
        attachments {
          id
          name
          url
        }
      }
    }
  }
`;
