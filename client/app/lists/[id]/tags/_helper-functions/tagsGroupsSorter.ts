import type { itemTag } from "@/types/item";

export interface GroupedTagType {
    groupName: string | null;
    groupTags: itemTag[];
}
// will sort each tag group into an object of 
// ArrayTags = [
// {
//  groupName: "x", 
//  groupTags: [{tag1..}, {tag2..}, ...]
// },
// {group 2}, ...]

export const tagsGroupsSorter = (tags: itemTag[]) => {
    const ArrayTags: GroupedTagType[] = [];

    tags.length > 0 && tags.forEach((tag) => {
        const groupName = tag.group_name || "" //if group_name doesn't exist go for null
        const groupExist = ArrayTags.find((group) => group.groupName === groupName);
        //groupExist: returns the refrance of the group's object in the array if it exists

        if (groupExist) {
            groupExist.groupTags.push(tag)
        } else {
            ArrayTags.push({
                groupName,
                groupTags: [tag],
            })
        }

    })

    //to make sure that grouplessTags are always at the begining
    const grouplessTags = ArrayTags.find(group => group.groupName == "")
    if (grouplessTags) {
        const index = ArrayTags.indexOf(grouplessTags);
        if (index !== -1) {
            ArrayTags.splice(index, 1);
            ArrayTags.unshift(grouplessTags);
        }
    }
    
    return ArrayTags;

}
