enum FriendStatus {
  ADD_FRIEND = 0, // Requester <-> Recipient
  REQUESTED = 1, // Requester -> Recipient
  PENDING = 2, // Recipient -> Requester
  FRIENDS = 3, // Requester <-> Recipient
}

export default FriendStatus;
