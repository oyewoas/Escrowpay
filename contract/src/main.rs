use stylus_hello_world::FreelanceEscrow; 

fn main() {
    #[cfg(feature = "export-abi")]
    {
        stylus_sdk::export_abi::<FreelanceEscrow>("stylus_hello_world.json")
            .expect("Failed to export ABI");
    }
    println!("Stylus contract ready for deployment");
}