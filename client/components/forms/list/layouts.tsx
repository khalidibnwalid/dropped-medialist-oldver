import ListBadgesForm from "@/components/forms/list/components/badges";
import ListExtraFieldsForm from "@/components/forms/list/components/extra-fields";
import ListLinksForm from "@/components/forms/list/components/links";
import ListMainFieldsForm from "@/components/forms/list/components/main-fields";
import ListProgressStateForm from "@/components/forms/list/components/progress-state";

export const ListFormLowerLayout = () => (
    <div className="grid grid-cols-3 gap-7 px-5 pb-20 animate-fade-in">
        <ListProgressStateForm />
        <ListMainFieldsForm />
        <ListExtraFieldsForm />
        <ListBadgesForm />
        <ListLinksForm />
    </div>
)