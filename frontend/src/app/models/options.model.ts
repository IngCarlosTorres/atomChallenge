
import { InfoItem } from './items.model'
export interface Menu {
    header: {
        home: InfoItem[];
        admin: InfoItem[];
    };
    footer: {
        home: InfoItem[];
    }
}