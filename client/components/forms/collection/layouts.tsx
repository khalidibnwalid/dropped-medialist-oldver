import CollectionBadgesForm from "@/components/forms/collection/components/badges";
import CollectionExtraFieldsForm from "@/components/forms/collection/components/extra-fields";
import CollectionLinksForm from "@/components/forms/collection/components/links";
import CollectionMainFieldsForm from "@/components/forms/collection/components/main-fields";
import CollectionProgressStateForm from "@/components/forms/collection/components/progress-state";

export const CollectionFormLowerLayout = () => (
    <div className="grid grid-cols-3 gap-7 px-5 pb-20 animate-fade-in">
        <CollectionProgressStateForm />
        <CollectionMainFieldsForm />
        <CollectionExtraFieldsForm />
        <CollectionBadgesForm />
        <CollectionLinksForm />
    </div>
)