/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getHabit = /* GraphQL */ `
  query GetHabit($id: ID!) {
    getHabit(id: $id) {
      id
      target
      repeat
      name
      active
      done
      createdAt
      ord
      updatedAt
      owner
    }
  }
`;
export const listHabits = /* GraphQL */ `
  query ListHabits(
    $filter: ModelHabitFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHabits(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        target
        repeat
        name
        active
        done
        createdAt
        ord
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
