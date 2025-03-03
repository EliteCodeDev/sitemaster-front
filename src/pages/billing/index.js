import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import Layout from "../../components/layout/dashboard";
import Billing from "./billing";
import Subscription from "./subscriptions";

export default function Index() {
    return (
        <Layout>
            <Tabs aria-label="Opciones de cuenta"   >
                <Tab key="subscriptions" title="Suscripciones" >
                    <Card>
                        <CardBody>
                            <Subscription />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="billing" title="Historial de pagos">
                    <Card>
                        <CardBody>
                            <Billing />
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </Layout>
    );
}
