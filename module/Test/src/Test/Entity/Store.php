<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/** 
 * @ORM\Entity
 */
class Store {
    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string", length=255, nullable=true) */
	protected $code;
	
	/** @ORM\Column(type="string", length=255, unique=true) */
	protected $name;
	
	/** @ORM\Column(type="string", length=255) */
	protected $address;
	
	/** @ORM\ManyToOne(targetEntity="User") */
	protected $manager;
	
	/** @ORM\OneToMany(targetEntity="Department", mappedBy="store") */
	protected $departments;

	/** @ORM\Column(type="boolean") */
	protected $disabled;
	
	public function __construct(){
	    $this->departments = new ArrayCollection();
		$this->disabled = false;
	}
	
	public function getId(){
	    return $this->id;
	}
    
    public function setId($id){
    	$this->id = $id;
    }
    
    public function getCode(){
    	return $this->code;
    }
    
    public function setCode($code){
    	$this->code = $code;
    }
 
    public function getName(){
    	return $this->name;
    }
    
    public function setName($name){
    	$this->name = $name;
    }

    public function getAddress(){
    	return $this->address;
    }
    
    public function setAddress($address){
    	$this->name = $address;
    }
    
    public function getManager(){
    	return $this->manager;
    }

    public function setManager($manager){
    	$this->grants = $manager;
    }
    
    public function hasDepartments() {
    	return $this->departments->count();
    }
    
    public function getDepartments() {
    	return $this->departments;
    }
    
    public function isDisabled(){
    	return $this->disabled?:false;
    }
    
    public function setDisabled($disabled){
    	$this->disabled = $disabled;
    }
    
    public function toArray()
    {
    	$array = get_object_vars($this);
    
    	$dps = [];
    	foreach($this->getDepartments()->toArray() as $dp){
    		$dps[$dp->getId()] = $dp->toArray();
    	}
    	$array['departments'] = $dps;

    	$array['manager_id'] = $this->getManager()?$this->getManager()->getId():null;
        $array['manager'] = $this->getManager()?$this->getManager()->getFullname():"";

    	return $array;
    }
}