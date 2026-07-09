import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import PageMeta from "../components/common/PageMeta";
function UserProfiles() {
  return <>
    <PageMeta
      title="Stocklyn - | Profile"
      description="This is an inventory management system that helps businesses keep track of their stock levels, orders, sales, and deliveries. It provides a centralized platform for managing inventory across multiple locations, streamlining operations, and improving efficiency."
    />
    <PageBreadcrumb pageTitle="Profile" />
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        Profile
      </h3>
      <div className="space-y-6">
        <UserInfoCard />
      </div>
    </div>
  </>;
}
export {
  UserProfiles as default
};
